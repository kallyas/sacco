from django.test import TestCase
from django.contrib.auth import get_user_model
from apps.authentication.models import Role
from ..models import Member, NextOfKin, MemberDocument
from datetime import date
from decimal import Decimal

User = get_user_model()


class MemberModelTest(TestCase):
    def setUp(self):
        # Create a role
        self.role = Role.objects.create(name='Member', description='Regular member')

        # Create a user
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            first_name='Test',
            last_name='User',
            role=self.role,
            phone_number='+256700000000',
            national_id='TEST123'
        )

        self.member_data = {
            'user': self.user,
            'member_number': 'M2024TEST001',
            'date_of_birth': date(1990, 1, 1),
            'marital_status': 'SINGLE',
            'employment_status': 'EMPLOYED',
            'occupation': 'Software Developer',
            'monthly_income': Decimal('5000000'),
            'physical_address': 'Test Address',
            'city': 'Kampala',
            'district': 'Central',
            'national_id': 'TEST123',
            'membership_number': 'SACCOM2024TEST001',
            'membership_type': 'INDIVIDUAL'
        }

    def test_create_member(self):
        member = Member.objects.create(**self.member_data)
        self.assertEqual(member.user, self.user)
        self.assertEqual(member.member_number, 'M2024TEST001')
        self.assertEqual(member.occupation, 'Software Developer')
        self.assertEqual(member.monthly_income, Decimal('5000000'))

    def test_member_string_representation(self):
        member = Member.objects.create(**self.member_data)
        expected_string = f"M2024TEST001 - Test User"
        self.assertEqual(str(member), expected_string)

    def test_create_next_of_kin(self):
        member = Member.objects.create(**self.member_data)

        next_of_kin = NextOfKin.objects.create(
            member=member,
            full_name='John Doe',
            relationship='SPOUSE',
            phone_number='+256701234567',
            physical_address='Kin Address',
            national_id='KIN123456',
            percentage_share=Decimal('100.00')
        )

        self.assertEqual(next_of_kin.member, member)
        self.assertEqual(next_of_kin.full_name, 'John Doe')
        self.assertEqual(next_of_kin.relationship, 'SPOUSE')

    def test_create_member_document(self):
        member = Member.objects.create(**self.member_data)

        document = MemberDocument.objects.create(
            member=member,
            document_type='ID',
            description='National ID document'
        )

        self.assertEqual(document.member, member)
        self.assertEqual(document.document_type, 'ID')
        self.assertFalse(document.is_verified)