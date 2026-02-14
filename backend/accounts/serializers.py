from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User
from rest_framework.exceptions import AuthenticationFailed

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('email', 'username', 'password')

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            username=validated_data.get('username', validated_data['email']),
            password=validated_data['password'],
            role=User.Role.LEARNER
        )
        return user
    
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(email=data['email'], password=data['password'])
        if not user:
            raise serializers.ValidationError("Invalid email or password")
        data['user'] = user
        return data

class UserRoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('role',)

    def validate_role(self, value):
        if value not in User.Role.values:
            raise serializers.ValidationError("Invalid role choice")
        return value

class UserListSerializer(serializers.ModelSerializer):
    """Serializer for listing users with all info for admin"""
    class Meta:
        model = User
        fields = ('id', 'email', 'username', 'role', 'is_active', 'is_deleted',
                  'deleted_at', 'date_joined', 'last_login')
        read_only_fields = ('id', 'is_deleted', 'deleted_at', 'date_joined', 'last_login')

class UserUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating user's name and email (not password or role)"""
    class Meta:
        model = User
        fields = ('username', 'email')

    def validate_email(self, value):
        # Check if email is already taken by another user
        user = self.instance
        if User.all_objects.filter(email=value).exclude(id=user.id).exists():
            raise serializers.ValidationError("This email is already in use")
        return value

    def validate_username(self, value):
        # Check if username is already taken by another user
        user = self.instance
        if User.all_objects.filter(username=value).exclude(id=user.id).exists():
            raise serializers.ValidationError("This username is already in use")
        return value