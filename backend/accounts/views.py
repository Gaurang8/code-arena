from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.decorators import permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from .permissions import IsAdmin
from .models import User
from rest_framework.response import Response
from django.contrib.auth import authenticate
from .serializers import LoginSerializer, RegisterSerializer, UserRoleSerializer, UserListSerializer, UserUpdateSerializer
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from core.utils.response import success_response, error_response
from core.utils.pagination import CustomPageNumberPagination
from django.db.models import Q

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            tokens = get_tokens_for_user(user)
            return success_response({
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'username': user.username,
                    'role': user.role
                },
                'tokens': tokens
            }, message='Login successful')
        return error_response(message='Login failed', errors=serializer.errors.get("non_field_errors", serializer.errors))

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return success_response(message='Logout successful', status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return error_response(message='Logout failed or token invalid')

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            tokens = get_tokens_for_user(user)
            return success_response({
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'username': user.username,
                    'role': user.role
                },
                'tokens': tokens
            }, message='Registration successful', status=status.HTTP_201_CREATED)
        return error_response(message='Registration failed', errors=serializer.errors)
    
class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return success_response({
            "id": user.id,
            "email": user.email,
            "username": user.username,
            "role": user.role
        })

class UserRoleUpdateView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def patch(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return error_response(message='User not found', status=status.HTTP_404_NOT_FOUND)

        serializer = UserRoleSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            updated_user = serializer.save()
            return success_response({
                "id": updated_user.id,
                "email": updated_user.email,
                "username": updated_user.username,
                "role": updated_user.role
             }, message='User role updated successfully')
        return error_response(message='Role update failed', errors=serializer.errors)


# ============================================
# ADMIN PANEL VIEWS
# ============================================

class AdminUserListView(APIView):
    """
    Admin API to list all users with pagination, search, and filters.

    Query Parameters:
    - page: Page number (default: 1)
    - page_size: Number of items per page (default: 10, max: 100)
    - search: Search by username or email
    - role: Filter by role (LEARNER or ADMIN)
    - is_deleted: Filter by deletion status
        - Not specified or 'false': Show only active users (DEFAULT)
        - 'true': Show only deleted users (for trash page)
        - 'all': Show all users (both active and deleted)
    """
    permission_classes = [IsAuthenticated, IsAdmin]
    pagination_class = CustomPageNumberPagination

    def get(self, request):
        # Determine which users to show based on is_deleted parameter
        is_deleted_param = request.query_params.get('is_deleted', 'false').lower()

        if is_deleted_param == 'true':
            # Show only deleted users (for trash page)
            queryset = User.all_objects.filter(is_deleted=True)
        elif is_deleted_param == 'all':
            # Show all users (both active and deleted)
            queryset = User.all_objects.all()
        else:
            # Default: Show only active users (non-deleted)
            queryset = User.objects.all()

        # Search by username or email
        search = request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(username__icontains=search) | Q(email__icontains=search)
            )

        # Filter by role
        role = request.query_params.get('role', None)
        if role:
            queryset = queryset.filter(role=role)

        # Order by date joined (newest first)
        queryset = queryset.order_by('-date_joined')

        # Paginate
        paginator = self.pagination_class()
        paginated_queryset = paginator.paginate_queryset(queryset, request)

        # Serialize
        serializer = UserListSerializer(paginated_queryset, many=True)

        # Return paginated response
        return paginator.get_paginated_response(serializer.data)


class AdminUserDetailUpdateView(APIView):
    """
    Admin API to update user's username and email (not password or role).
    """
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request, user_id):
        """Get details of a specific user"""
        try:
            user = User.all_objects.get(id=user_id)
            serializer = UserListSerializer(user)
            return success_response(serializer.data, message='User details retrieved successfully')
        except User.DoesNotExist:
            return error_response(message='User not found', status=status.HTTP_404_NOT_FOUND)

    def patch(self, request, user_id):
        """Update user's username and email"""
        try:
            user = User.all_objects.get(id=user_id)
        except User.DoesNotExist:
            return error_response(message='User not found', status=status.HTTP_404_NOT_FOUND)

        serializer = UserUpdateSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            updated_user = serializer.save()
            return success_response({
                "id": updated_user.id,
                "email": updated_user.email,
                "username": updated_user.username,
                "role": updated_user.role
            }, message='User updated successfully')
        return error_response(message='Update failed', errors=serializer.errors)


class AdminUserDeleteView(APIView):
    """
    Admin API to soft delete a user.
    """
    permission_classes = [IsAuthenticated, IsAdmin]

    def delete(self, request, user_id):
        """Soft delete a user"""
        try:
            user = User.objects.get(id=user_id)

            # Prevent admin from deleting themselves
            if user.id == request.user.id:
                return error_response(
                    message='You cannot delete your own account',
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Perform soft delete
            user.soft_delete()

            return success_response(
                message='User deleted successfully',
                status=status.HTTP_200_OK
            )
        except User.DoesNotExist:
            return error_response(message='User not found', status=status.HTTP_404_NOT_FOUND)


class AdminUserRestoreView(APIView):
    """
    Admin API to restore a soft-deleted user.
    """
    permission_classes = [IsAuthenticated, IsAdmin]

    def post(self, request, user_id):
        """Restore a soft-deleted user"""
        try:
            user = User.all_objects.get(id=user_id, is_deleted=True)
            user.restore()

            return success_response({
                "id": user.id,
                "email": user.email,
                "username": user.username,
                "role": user.role
            }, message='User restored successfully')
        except User.DoesNotExist:
            return error_response(
                message='Deleted user not found',
                status=status.HTTP_404_NOT_FOUND
            )