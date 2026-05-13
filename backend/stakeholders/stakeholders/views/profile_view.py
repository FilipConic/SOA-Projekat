from rest_framework import viewsets, permissions

from ..serializers.user_info_serializer import UserInfoSerializer
from ..models.profile import Profile
from ..serializers.profile_serializer import ProfileSerializer
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser, FormParser
from ..serializers.avatar_seriallizer import AvatarSerializer

class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['get'])
    def me(self, request):
        profile = Profile.objects.get(user = request.user)
        serializer = self.get_serializer(profile)
        return Response(serializer.data)
    
    @action(detail=False, methods=['put', 'patch'])
    def update_profile(self, request):
        profile = request.user.profile
        serializer = self.get_serializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    @action(detail=False, methods=['post'], parser_classes=[MultiPartParser, FormParser])
    def upload_avatar(self, request):
        profile = request.user.profile
        serializer = AvatarSerializer(profile, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Avatar updated successfully.", "url": profile.avatar.url}, status=200)
        
        return Response(serializer.errors, status=400)
    
    @action(detail=True, methods=['get'])
    def get_profile(self, request, pk=None):
        try:
            profile = Profile.objects.get(user__id=pk)
        except Profile.DoesNotExist:
            return Response({"error": "Profile not found."}, status=404)
        serializer = self.get_serializer(profile)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def get_user_info(self, request, pk=None):
        try:
            profile = Profile.objects.get(user__id=pk)
        except Profile.DoesNotExist:
            return Response({"error": "Profile not found."}, status=404)
        serializer = UserInfoSerializer(profile)
        return Response(serializer.data)