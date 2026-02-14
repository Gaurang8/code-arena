from django.db import models
from django.contrib.auth.models import AbstractUser, UserManager
from django.utils import timezone

# Custom manager for active users only
class ActiveUserManager(UserManager):
    def get_queryset(self):
        return super().get_queryset().filter(is_deleted=False)

# Create your models here.
class User(AbstractUser):
     
    class Role(models.TextChoices):
        LEARNER = 'LEARNER', 'Learner'
        ADMIN = 'ADMIN', 'Admin'

    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150, unique=True, blank=True)

    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.LEARNER
    )

    # Soft delete fields
    is_deleted = models.BooleanField(default=False)
    deleted_at = models.DateTimeField(null=True, blank=True)

    # Managers
    objects = ActiveUserManager()  # Default manager - returns only active users
    all_objects = UserManager()    # Returns all users including deleted

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email

    def soft_delete(self):
        """Soft delete the user"""
        self.is_deleted = True
        self.deleted_at = timezone.now()
        self.save()

    def restore(self):
        """Restore a soft-deleted user"""
        self.is_deleted = False
        self.deleted_at = None
        self.save()
