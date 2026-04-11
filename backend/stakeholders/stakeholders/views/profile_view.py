from rest_framework import viewsets, permissions
from ..models.profile import Profile
from ..serializers.profile_serializer import ProfileSerializer
from rest_framework.response import Response
from rest_framework.decorators import action

class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['get'])
    def me(self, request):
        profile = Profile.objects.get(user = request.user)
        serializer = self.get_serializer(profile)
        return Response(serializer.data)