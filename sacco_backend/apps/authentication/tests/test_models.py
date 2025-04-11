from django.test import TestCase
from django.contrib.auth import get_user_model
from ..models import Role, Permission

User = get_user_model()

class UserModelTest(TestCase):
    def setUp(self):
        self.role = Role.objects.create(name='TEST_ROLE')
        self.user_data = {
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
        self.assertEqual(user.first_name, self.user_data['first_name'])
        self.assertEqual(user.last_name, self.user_data['last_name'])
        self.assertEqual(user.role, self.role)
