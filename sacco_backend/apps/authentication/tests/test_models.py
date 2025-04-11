from django.test import TestCase
from django.contrib.auth import get_user_model
from ..models import Role, Permission

User = get_user_model()

class UserModelTest(TestCase):
    def setUp(self):
        self.role = Role.objects.create(name='TEST_ROLE')
        self.user_data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'testpass123',
            'first_name': 'Test',
            'last_name': 'User',
            'phone_number': '+256700000000',
            'national_id': 'TEST123',
            'role': self.role
        }

    def test_create_user(self):
        user = User.objects.create(**self.user_data)
        self.assertEqual(user.username, self.user_data['username'])
        self.assertTrue(user.check_password(self.user_data['password']))
        self.assertEqual(user.role, self.role)
