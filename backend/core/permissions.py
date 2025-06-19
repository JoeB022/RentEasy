from rest_framework.permissions import BasePermission

class IsTenant(BasePermission):
    """Allows access only to users with the 'tenant' role."""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'tenant'


class IsLandlord(BasePermission):
    """Allows access only to users with the 'landlord' role."""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['landlord', 'admin']


class IsAdmin(BasePermission):
    """Allows access only to users with the 'admin' role."""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'