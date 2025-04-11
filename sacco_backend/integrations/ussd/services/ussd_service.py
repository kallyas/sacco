from datetime import datetime
from decimal import Decimal
from typing import Tuple

from apps.integrations.models import USSDSession
from apps.loans.models import Loan
from apps.loans.services.loan_service import LoanService
from apps.members.models import Member
from apps.notifications.services.notification_service import NotificationService
from apps.transactions.models import Transaction
from apps.transactions.services.transaction_service import TransactionService


class USSDService:
    MENU_OPTIONS = {
        'MAIN': """Welcome to SACCO
1. Check Balance
2. Mini Statement
3. Send Money
4. Loan Status
5. Make Payment
6. More Options""",

        'MORE_OPTIONS': """More Options
1. Update PIN
2. Request Statement
3. Apply for Loan
4. Contact Support
0. Back to Main Menu""",
    }

    @staticmethod
    def process_request(
            session_id: str,
            phone_number: str,
            text: str
    ) -> Tuple[str, bool]:
        """Process USSD request and return response and continuation flag"""

        session = USSDService._get_or_create_session(session_id, phone_number)

        if not text:
            # New session, show main menu
            return USSDService.MENU_OPTIONS['MAIN'], True

        if not session.member:
            return "Please visit nearest branch to register for USSD banking", False

        menu_response = USSDService._handle_menu_selection(session, text)
        return menu_response

    @staticmethod
    def _get_or_create_session(session_id: str, phone_number: str) -> USSDSession:
        """Get existing session or create new one"""
        try:
            session = USSDSession.objects.get(
                session_id=session_id,
                status='ACTIVE'
            )
            return session
        except USSDSession.DoesNotExist:
            member = Member.objects.filter(
                user__phone_number=phone_number
            ).first()

            return USSDSession.objects.create(
                session_id=session_id,
                phone_number=phone_number,
                member=member,
                current_menu='MAIN',
                status='ACTIVE'
            )

    @staticmethod
    def _handle_menu_selection(session: USSDSession, text: str) -> Tuple[str, bool]:
        """Handle menu selection based on current menu and input"""

        if session.current_menu == 'MAIN':
            return USSDService._handle_main_menu(session, text)
        elif session.current_menu == 'MORE_OPTIONS':
            return USSDService._handle_more_options(session, text)
        elif session.current_menu == 'SEND_MONEY':
            return USSDService._handle_send_money(session, text)
        elif session.current_menu == 'MAKE_PAYMENT':
            return USSDService._handle_payment(session, text)

        return "Invalid menu selection", False

    @staticmethod
    def _handle_main_menu(session: USSDSession, text: str) -> Tuple[str, bool]:
        """Handle main menu selections"""

        if text == "1":
            # Check Balance
            balance = USSDService._get_account_balance(session.member)
            return f"Your account balance is: UGX {balance:,.2f}", False

        elif text == "2":
            # Mini Statement
            transactions = USSDService._get_mini_statement(session.member)
            return transactions, False

        elif text == "3":
            # Send Money
            session.current_menu = 'SEND_MONEY'
            session.session_data['send_money_step'] = 'ENTER_PHONE'
            session.asave()
            return "Enter recipient's phone number:", True

        elif text == "4":
            # Loan Status
            loan_status = USSDService._get_loan_status(session.member)
            return loan_status, False

        elif text == "5":
            # Make Payment
            session.current_menu = 'MAKE_PAYMENT'
            session.session_data['payment_step'] = 'ENTER_AMOUNT'
            session.asave()
            return "Enter amount to pay:", True

        elif text == "6":
            # More Options
            session.current_menu = 'MORE_OPTIONS'
            session.asave()
            return USSDService.MENU_OPTIONS['MORE_OPTIONS'], True

        return "Invalid selection", False

    @staticmethod
    def _handle_send_money(session: USSDSession, text: str) -> Tuple[str, bool]:
        """Handle send money flow"""
        step = session.session_data.get('send_money_step')

        if step == 'ENTER_PHONE':
            session.session_data['recipient_phone'] = text
            session.session_data['send_money_step'] = 'ENTER_AMOUNT'
            session.asave()
            return "Enter amount to send:", True

        elif step == 'ENTER_AMOUNT':
            try:
                amount = Decimal(text)
                result = USSDService._process_money_transfer(
                    session.member,
                    session.session_data['recipient_phone'],
                    amount
                )
                session.status = 'COMPLETED'
                session.asave()
                return result, False
            except ValueError:
                return "Invalid amount entered", False

    @staticmethod
    def _get_account_balance(member: Member) -> Decimal:
        """Get member's account balance"""
        savings_account = member.savings_account
        return savings_account.balance if savings_account else Decimal('0')

    @staticmethod
    def _get_mini_statement(member: Member) -> str:
        """Get member's mini statement"""
        transactions = Transaction.objects.filter(
            member=member
        ).order_by('-created_at')[:5]

        statement = "Recent Transactions:\n"
        for tx in transactions:
            statement += f"{tx.created_at.strftime('%d/%m')}: {tx.transaction_type} - UGX {tx.amount:,.2f}\n"
        return statement

    @staticmethod
    def _get_loan_status(member: Member) -> str:
        """Get member's loan status"""
        active_loan = Loan.objects.filter(
            member=member,
            status='ACTIVE'
        ).first()

        if not active_loan:
            return "No active loans found"

        return f"""Loan Status:
Amount: UGX {active_loan.amount:,.2f}
Outstanding: UGX {active_loan.outstanding_balance:,.2f}
Next Payment: {active_loan.next_payment_date}"""

    @staticmethod
    def _process_money_transfer(
            sender: Member,
            recipient_phone: str,
            amount: Decimal
    ) -> str:
        """Process money transfer between members"""
        try:
            recipient = Member.objects.filter(
                phone_number=recipient_phone
            ).first()

            if not recipient:
                return "Recipient not found"

            result = TransactionService.create_transaction(
                sender.id,
                'TRANSFER',
                amount,
                'INTERNAL',
                destination_member=recipient.id
            )

            return f"Successfully sent UGX {amount:,.2f} to {recipient_phone}"
        except Exception as e:
            return f"Transfer failed: {str(e)}"

    @staticmethod
    def _handle_payment(session: USSDSession, text: str) -> Tuple[str, bool]:
        """Handle loan payment flow"""
        step = session.session_data.get('payment_step')

        if step == 'ENTER_AMOUNT':
            try:
                amount = Decimal(text)
                active_loan = Loan.objects.filter(
                    member=session.member,
                    status='ACTIVE'
                ).first()

                if not active_loan:
                    return "No active loans found", False

                if amount > active_loan.outstanding_balance:
                    return f"Amount exceeds outstanding balance (UGX {active_loan.outstanding_balance:,.2f})", False

                session.session_data['payment_amount'] = str(amount)
                session.session_data['payment_step'] = 'CONFIRM'
                session.asave()

                return f"""Confirm loan payment:
    Amount: UGX {amount:,.2f}
    Loan ID: {active_loan.reference}
    1. Confirm
    2. Cancel""", True

            except ValueError:
                return "Invalid amount entered", False

        elif step == 'CONFIRM':
            if text == "1":
                try:
                    amount = Decimal(session.session_data['payment_amount'])
                    result = TransactionService.create_transaction(
                        session.member.id,
                        'LOAN_REPAYMENT',
                        amount,
                        'USSD'
                    )
                    session.status = 'COMPLETED'
                    session.asave()
                    return f"Payment of UGX {amount:,.2f} successful", False
                except Exception as e:
                    return f"Payment failed: {str(e)}", False
            elif text == "2":
                session.status = 'COMPLETED'
                session.asave()
                return "Payment cancelled", False
            else:
                return "Invalid selection", True

        return "Invalid payment step", False

    @staticmethod
    def _handle_more_options(session: USSDSession, text: str) -> Tuple[str, bool]:
        """Handle more options menu selections"""

        if text == "1":
            # Update PIN
            session.current_menu = 'UPDATE_PIN'
            session.session_data['pin_step'] = 'ENTER_CURRENT'
            session.asave()
            return "Enter current PIN:", True

        elif text == "2":
            # Request Statement
            session.status = 'COMPLETED'
            session.asave()

            # Schedule statement delivery
            NotificationService.schedule_statement_delivery(
                session.member,
                'EMAIL',
                datetime.now()
            )
            return "Statement will be sent to your registered email", False

        elif text == "3":
            # Apply for Loan
            # Check eligibility
            eligible, reason = LoanService.check_eligibility(session.member)
            if not eligible:
                return f"Loan application not possible: {reason}", False

            session.current_menu = 'LOAN_APPLICATION'
            session.session_data['loan_step'] = 'ENTER_AMOUNT'
            session.asave()
            return "Enter desired loan amount:", True

        elif text == "4":
            # Contact Support
            support_info = """Contact Support:
    Call: 0800-SACCO
    Email: support@sacco.com
    Visit: Any branch
    Working hours: 8AM-5PM"""
            session.status = 'COMPLETED'
            session.asave()
            return support_info, False

        elif text == "0":
            # Back to main menu
            session.current_menu = 'MAIN'
            session.asave()
            return USSDService.MENU_OPTIONS['MAIN'], True

        return "Invalid selection", True
