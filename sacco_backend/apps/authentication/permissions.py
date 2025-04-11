from rest_framework import permissions


class HasRolePermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        required_role = getattr(view, 'required_role', None)
        if not required_role:
            return True

        return request.user.role and request.user.role.name == required_role
