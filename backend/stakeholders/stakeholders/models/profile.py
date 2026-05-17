from django.db import models
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver

def user_directory_path(instance, filename):
    # Funkcija sluzi za generisanje putanje do foldera za cuvanje avatara korisnika
    # Sluzi samo za bolju organizaciju fajlova
    return f'avatars/user_{instance.user.id}/{filename}'

class Profile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='profile'
    )
    
    first_name = models.CharField(max_length=30, blank=True)
    last_name = models.CharField(max_length=30, blank=True)
    avatar = models.ImageField(upload_to=user_directory_path, blank=True, null=True)
    bio = models.TextField(max_length=500, blank=True)
    quote = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f"{self.user.username}'s Profile"
    
    class Meta:
        db_table = 'profiles'

@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)