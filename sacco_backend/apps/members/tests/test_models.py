from django.test import TestCase
from django.contrib.auth import get_user_model
from ..models import Member, NextOfKin, MemberDocument
from datetime import date

User = get_user_model()


class MemberModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create(
            username='testuser',
            password='testpass123'
        )

        self.member_data = {
            'user': self.user,
            'member_number': 'M2024TEST001',
            'date_of_birth': date(1990, 1, 1),
            'marital_status': 'SINGLE',
            'employment_status': 'EMPLOYED',
            'occupation': 'Software Developer',
            'monthly_income': 5000000,
            'physical_address': 'Test Address',
            'city': 'Kampala',
            'district': 'Central',
            'national_id': 'TEST123456',
            'membership_number': 'SACCOM2024TEST001'
        }

    def test_create_member(self):
        member = Member.objects.create(**self.member_data)
        self.assertEqual(member.user, self.user)
        self.assertEqual(member.member_number, 'M2024TEST001')
