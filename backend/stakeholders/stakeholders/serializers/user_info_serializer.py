from rest_framework import serializers
from ..models.profile import Profile

class UserInfoSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Profile
        fields = ['username', 'avatar']