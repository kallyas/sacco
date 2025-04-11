from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

User = get_user_model()


class MemberViewsTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create(
            username='testuser',
            password='testpass123'
        )

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
            'national_id': 'TEST123456'
        }

    def test_create_member(self):
        url = reverse('member-list')
        response = self.client.post(url, {
            'member': self.member_data,
            'next_of_kin': []
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)