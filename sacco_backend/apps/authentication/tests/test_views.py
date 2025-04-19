from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from django.contrib.auth import get_user_model
from ..models import Role

User = get_user_model()


class AuthViewsTest(APITestCase):
    def setUp(self):
        self.role = Role.objects.create(name='TEST_ROLE')
        self.register_url = reverse('auth-register')
        self.login_url = reverse('auth-login')
        self.user_data = {
            'email': 'test@example.com',
            'password': 'testpass123',
            'confirm_password': 'testpass123',
            'first_name': 'Test',
            'last_name': 'User',
            'phone_number': '+256700000000',
            'national_id': 'TEST123'
        }

    def test_user_registration(self):
        response = self.client.post(self.register_url, self.user_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(email=self.user_data['email']).exists())

        # Check response structure
        self.assertIn('user', response.data)
        self.assertIn('tokens', response.data)
        self.assertIn('email', response.data['user'])
        self.assertIn('access_token', response.data['tokens'])
        self.assertIn('refresh_token', response.data['tokens'])

    def test_user_login(self):
        # First create a user
        user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            first_name='Test',
            last_name='User',
            phone_number='+256700000000',
            national_id='TEST123',
            role=self.role
        )

        # Login with correct credentials
        login_data = {
            'email': 'test@example.com',
            'password': 'testpass123'
        }

        response = self.client.post(self.login_url, login_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('user', response.data)
        self.assertIn('tokens', response.data)

    def test_login_with_invalid_credentials(self):
        # Login with incorrect credentials
        login_data = {
            'email': 'test@example.com',
            'password': 'wrongpassword'
        }

        response = self.client.post(self.login_url, login_data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn('error', response.data)

    def test_registration_with_mismatched_passwords(self):
        # Try to register with mismatched passwords
        invalid_data = self.user_data.copy()
        invalid_data['confirm_password'] = 'differentpassword'

        response = self.client.post(self.register_url, invalid_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_me_endpoint(self):
        # Create and authenticate user
        user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            first_name='Test',
            last_name='User',
            phone_number='+256700000000',
            national_id='TEST123',
            role=self.role
        )
        self.client.force_authenticate(user=user)

        # Test the me endpoint
        me_url = reverse('auth-me')
        response = self.client.get(me_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], 'test@example.com')