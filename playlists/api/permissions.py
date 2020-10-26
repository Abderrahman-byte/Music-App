from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsAuthorReadOnlyIfPublic(BasePermission) :
    def has_object_permission(self, request, view, obj) :
        return bool(request.user == obj.author) or bool(request.method in SAFE_METHODS and obj.is_public)