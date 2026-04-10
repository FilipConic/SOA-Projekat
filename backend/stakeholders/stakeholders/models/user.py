from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    class Role(models.TextChoices):
        ADMIN = 'ADMIN', 'Admin',
        Tourist = 'TOURIST', 'Tourist',
        Guide = 'GUIDE', 'Guide',
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.Tourist)

    email = models.EmailField(unique=True)

    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.username