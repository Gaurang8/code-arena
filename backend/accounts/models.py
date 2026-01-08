from django.db import models
from django.contrib.auth.models import AbstractUser

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


    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email
