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
        user = User.objects.create_user(**self.user_data)
        self.assertEqual(user.email, self.user_data['email'])
        self.assertEqual(user.first_name, self.user_data['first_name'])
        self.assertEqual(user.last_name, self.user_data['last_name'])
        self.assertEqual(user.role, self.role)
        self.assertTrue(user.check_password('testpass123'))
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)

    def test_create_superuser(self):
        # Create a superuser
        admin_user = User.objects.create_superuser(
            email='admin@example.com',
            password='adminpass123',
            first_name='Admin',
            last_name='User',
            phone_number='+256711111111',
            national_id='ADMIN123'
        )

        self.assertEqual(admin_user.email, 'admin@example.com')
        self.assertTrue(admin_user.is_staff)
        self.assertTrue(admin_user.is_superuser)
        self.assertTrue(admin_user.check_password('adminpass123'))

    def test_user_str_method(self):
        user = User.objects.create_user(**self.user_data)
        expected_str = user.email
        self.assertEqual(str(user), expected_str)


class RoleModelTest(TestCase):
    def test_create_role(self):
        role = Role.objects.create(
            name='MANAGER',
            description='Manager role'
        )

        self.assertEqual(role.name, 'MANAGER')
        self.assertEqual(role.description, 'Manager role')
        self.assertTrue(role.is_active)

    def test_role_str_method(self):
        role = Role.objects.create(name='ADMIN')
        self.assertEqual(str(role), 'ADMIN')


class PermissionModelTest(TestCase):
    def setUp(self):
        self.role = Role.objects.create(name='TESTER')

    def test_create_permission(self):
        permission = Permission.objects.create(
            name='Test Permission',
            codename='test_permission',
            description='Permission for testing'
        )

        # Add the role to the permission
        permission.roles.add(self.role)

        self.assertEqual(permission.name, 'Test Permission')
        self.assertEqual(permission.codename, 'test_permission')
        self.assertEqual(permission.roles.first(), self.role)

    def test_permission_str_method(self):
        permission = Permission.objects.create(
            name='View Reports',
            codename='view_reports'
        )
        self.assertEqual(str(permission), 'View Reports')