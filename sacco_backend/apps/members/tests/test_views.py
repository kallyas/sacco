import json
from decimal import Decimal
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from apps.authentication.models import Role
from apps.members.models import Member
from apps.members.services.member_service import MemberService

User = get_user_model()


class MemberViewsTest(APITestCase):
    def setUp(self):
        # Create role
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

        # Authenticate the client
        self.client.force_authenticate(user=self.user)

        self.member_data = {
            'date_of_birth': '1990-01-01',
            'marital_status': 'SINGLE',
            'employment_status': 'EMPLOYED',
            'occupation': 'Software Developer',
            'monthly_income': '5000000',
            'physical_address': 'Test Address',
            'city': 'Kampala',
            'district': 'Central',
            'national_id': 'TEST123XYZ',
            'membership_type': 'INDIVIDUAL'
        }

        # Patch the generate_member_number method to return a predictable value
        self.original_generate_member_number = MemberService.generate_member_number
        MemberService.generate_member_number = lambda: 'M2024TEST123'

    def tearDown(self):
        # Restore the original method
        MemberService.generate_member_number = self.original_generate_member_number

    def test_create_member(self):
        url = reverse('members-list')
        request_data = {
            'member': self.member_data,
            'next_of_kin': []
        }
        response = self.client.post(url, json.dumps(request_data), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Check that a member was created
        self.assertTrue(Member.objects.filter(user=self.user).exists())
        member = Member.objects.get(user=self.user)
        self.assertEqual(member.member_number, 'M2024TEST123')

    def test_get_me_endpoint(self):
        # First create a member for the logged-in user
        member = Member.objects.create(
            user=self.user,
            member_number='M2024TEST001',
            date_of_birth='1990-01-01',
            marital_status='SINGLE',
            employment_status='EMPLOYED',
            occupation='Software Developer',
            monthly_income=Decimal('5000000'),
            physical_address='Test Address',
            city='Kampala',
            district='Central',
            national_id='TEST123',
            membership_number='SACCOM2024TEST001',
            membership_type='INDIVIDUAL'
        )

        url = reverse('members-me')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['member_number'], 'M2024TEST001')

    def test_member_update(self):
        # First create a member for the logged-in user
        member = Member.objects.create(
            user=self.user,
            member_number='M2024TEST001',
            date_of_birth='1990-01-01',
            marital_status='SINGLE',
            employment_status='EMPLOYED',
            occupation='Software Developer',
            monthly_income=Decimal('5000000'),
            physical_address='Test Address',
            city='Kampala',
            district='Central',
            national_id='TEST123',
            membership_number='SACCOM2024TEST001',
            membership_type='INDIVIDUAL'
        )

        url = reverse('members-detail', args=[member.id])
        update_data = {
            'occupation': 'Data Scientist',
            'monthly_income': '6000000'
        }
        response = self.client.patch(url, update_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Refresh member from database
        member.refresh_from_db()
        self.assertEqual(member.occupation, 'Data Scientist')
        self.assertEqual(member.monthly_income, Decimal('6000000'))