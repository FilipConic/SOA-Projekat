from rest_framework import viewsets, permissions
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
    
    @action(detail=False, methods=['post'], parser_classes=[MultiPartParser, FormParser])
    def upload_avatar(self, request):
        profile = request.user.profile
        serializer = AvatarSerializer(profile, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Avatar updated successfully.", "url": profile.avatar.url}, status=200)
        
        return Response(serializer.errors, status=400)