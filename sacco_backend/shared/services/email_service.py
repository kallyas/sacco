from typing import Optional

from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from email.mime.image import MIMEImage
import os
import logging

logger = logging.getLogger(__name__)


class EmailService:
    @staticmethod
    async def send_email(
            to_email: str,
            subject: str,
            template_name: str,
            context: dict,
            attachments: Optional[list] = None
    ) -> bool:
        """Send email using template"""
        try:
            # Render HTML content
            html_content = render_to_string(f'emails/{template_name}', context)
            text_content = strip_tags(html_content)

            # Create email message
            msg = EmailMultiAlternatives(
                subject,
                text_content,
                settings.DEFAULT_FROM_EMAIL,
                [to_email]
            )
            msg.attach_alternative(html_content, "text/html")

            # Add logo if exists
            if os.path.exists('static/images/logo.png'):
                with open('static/images/logo.png', 'rb') as f:
                    logo_data = f.read()
                    logo = MIMEImage(logo_data)
                    logo.add_header('Content-ID', '<logo>')
                    msg.attach(logo)

            # Add attachments
            if attachments:
                for attachment in attachments:
                    msg.attach_file(attachment)

            await msg.send()
            return True

        except Exception as e:
            logger.error(f"Email sending failed: {str(e)}")
            return False

    @staticmethod
    async def send_bulk_emails(
            recipients: list,
            subject: str,
            template_name: str,
            context: dict
    ) -> list:
        """Send bulk emails"""
        results = []
        for recipient in recipients:
            try:
                success = await EmailService.send_email(
                    recipient,
                    subject,
                    template_name,
                    context
                )
                results.append({'email': recipient, 'status': 'success' if success else 'failed'})
            except Exception as e:
                results.append({'email': recipient, 'status': 'failed', 'error': str(e)})
        return results
