from rest_framework import serializers
from ..models.profile import Profile
import os

class AvatarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['avatar']

    def validate_avatar(self, value):
        if not value:
            raise serializers.ValidationError("Avatar image is required.")
        if value.size > 5 * 1024 * 1024: # Limit od 5mb za profilnu
            raise serializers.ValidationError("Avatar image size should not exceed 2MB.")
        return value
    
    def save(self, **kwargs):
        if self.instance.avatar:
            if os.path.isfile(self.instance.avatar.path):
                os.remove(self.instance.avatar.path)
        return super().save(**kwargs)