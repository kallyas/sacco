from datetime import timedelta
from decimal import Decimal

from django.db.models import F
from django.utils import timezone

from apps.loans.models import LoanRepayment, Loan, LoanApplication
from apps.members.models import Member
from apps.risk_management.models import RiskProfile
from apps.risk_management.utils.complience_utils import verify_kyc
from apps.transactions.models import Transaction


class RiskAssessmentService:
    @staticmethod
    async def assess_member_risk(member_id: int) -> RiskProfile:
        member = await Member.objects.aget(id=member_id)

        credit_score = await RiskAssessmentService._calculate_credit_score(member)
        risk_factors = await RiskAssessmentService._identify_risk_factors(member)

        risk_level = RiskAssessmentService._determine_risk_level(credit_score, risk_factors)

        profile, created = await RiskProfile.objects.aupdate_or_create(
            member=member,
            defaults={
                'credit_score': credit_score,
                'risk_level': risk_level,
                'last_assessment_date': timezone.now(),
                'next_assessment_date': timezone.now() + timedelta(days=90),
                'factors': risk_factors
            }
        )

        return profile

    @staticmethod
    async def _calculate_credit_score(member: Member) -> int:
        factors = {
            'payment_history': await RiskAssessmentService._analyze_payment_history(member),
            'credit_utilization': await RiskAssessmentService._calculate_credit_utilization(member),
            'account_age': await RiskAssessmentService._calculate_account_age(member),
            'recent_inquiries': await RiskAssessmentService._check_recent_inquiries(member)
        }

        weights = {
            'payment_history': 0.35,
            'credit_utilization': 0.30,
            'account_age': 0.25,
            'recent_inquiries': 0.10
        }

        score = sum(score * weights[factor] for factor, score in factors.items())
        return min(max(int(score), 300), 850)

    @staticmethod
    def _determine_risk_level(credit_score: int, risk_factors: dict) -> str:
        if credit_score >= 750:
            return 'LOW'
        elif credit_score >= 650:
            return 'MEDIUM'
        elif credit_score >= 550:
            return 'HIGH'
        return 'CRITICAL'

    @staticmethod
    async def _identify_risk_factors(member: Member) -> dict:
        factors = {
            'loan_history': await RiskAssessmentService._analyze_loan_history(member),
            'transaction_patterns': await RiskAssessmentService._analyze_transaction_patterns(member),
            'kyc_status': await verify_kyc(member),
            'account_status': member.membership_status
        }

        risk_scores = {
            'loan_history': factors['loan_history'].get('risk_score', 0),
            'transaction_patterns': factors['transaction_patterns'].get('risk_score', 0),
            'kyc_status': 0 if factors['kyc_status'] else 50,
            'account_status': 0 if factors['account_status'] == 'ACTIVE' else 30
        }

        return {'factors': factors, 'risk_scores': risk_scores}

    @staticmethod
    async def identify_risk_factors(member: Member) -> dict:
        return await RiskAssessmentService._identify_risk_factors(member)

    @staticmethod
    async def _analyze_payment_history(member: Member) -> int:
        loan_repayments = await LoanRepayment.objects.filter(
            loan__member=member,
            due_date__lte=timezone.now()
        ).acount()

        late_payments = await LoanRepayment.objects.filter(
            loan__member=member,
            due_date__lte=timezone.now(),
            payment_date__gt=F('due_date')
        ).acount()

        if loan_repayments == 0:
            return 700  # Neutral score for new members

        on_time_ratio = 1 - (late_payments / loan_repayments)
        return int(850 * on_time_ratio)

    @staticmethod
    async def _calculate_credit_utilization(member: Member) -> int:
        total_loan_limit = Decimal('0')
        current_loans = Decimal('0')

        async for loan in Loan.objects.filter(member=member, status='ACTIVE'):
            total_loan_limit += loan.amount
            current_loans += loan.outstanding_balance

        if total_loan_limit == 0:
            return 850  # Perfect score for no loans

        utilization_ratio = current_loans / total_loan_limit
        return int(850 * (1 - min(utilization_ratio, 1)))

    @staticmethod
    async def _calculate_account_age(member: Member) -> int:
        days_active = (timezone.now().date() - member.registration_date).days
        max_age_points = 850
        max_age_days = 365 * 5  # 5 years for max score

        return min(int((days_active / max_age_days) * max_age_points), max_age_points)

    @staticmethod
    async def _check_recent_inquiries(member: Member) -> int:
        recent_inquiries = await LoanApplication.objects.filter(
            member=member,
            submitted_date__gte=timezone.now() - timedelta(days=90)
        ).acount()

        max_score = 850
        penalty_per_inquiry = 20
        return max(max_score - (recent_inquiries * penalty_per_inquiry), 300)

    @staticmethod
    async def _analyze_loan_history(member: Member) -> dict:
        loans = await Loan.objects.filter(member=member).aall()
        total_loans = len(loans)
        defaults = 0
        early_payments = 0
        current_debt = Decimal('0')

        for loan in loans:
            if loan.status == 'DEFAULTED':
                defaults += 1
            current_debt += loan.outstanding_balance if loan.status == 'ACTIVE' else 0

            repayments = await loan.repayments.filter(
                payment_date__lt=F('due_date')
            ).acount()
            early_payments += repayments

        risk_score = 850
        if total_loans > 0:
            default_ratio = defaults / total_loans
            risk_score -= int(default_ratio * 400)

            early_payment_bonus = int((early_payments / (total_loans * 12)) * 100)
            risk_score = min(850, risk_score + early_payment_bonus)

        return {
            'total_loans': total_loans,
            'defaults': defaults,
            'early_payments': early_payments,
            'current_debt': float(current_debt),
            'risk_score': max(300, risk_score)
        }

    @staticmethod
    async def _analyze_transaction_patterns(member: Member) -> dict:
        last_month = timezone.now() - timedelta(days=30)
        transactions = await Transaction.objects.filter(
            member=member,
            created_at__gte=last_month
        ).aall()

        total_volume = sum(t.amount for t in transactions)
        avg_transaction = total_volume / len(transactions) if transactions else 0

        unusual_patterns = 0
        for idx in range(1, len(transactions)):
            time_diff = transactions[idx].created_at - transactions[idx - 1].created_at
            if time_diff.total_seconds() < 300:  # 5 minutes
                unusual_patterns += 1

        risk_score = 850
        if unusual_patterns > 0:
            risk_score -= unusual_patterns * 50

        return {
            'transaction_count': len(transactions),
            'total_volume': float(total_volume),
            'average_transaction': float(avg_transaction),
            'unusual_patterns': unusual_patterns,
            'risk_score': max(300, risk_score)
        }