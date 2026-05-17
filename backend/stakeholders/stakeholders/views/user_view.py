from rest_framework import viewsets, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth import get_user_model

from stakeholders.models import user
from stakeholders.serializers.user_serializer import UserSerializer
from permissions import IsAdminRole

User = get_user_model()

class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        if self.action in ['list', 'update', 'partial_update']:
            return [IsAdminRole()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        if self.action == 'list':
            return User.objects.exclude(role=User.Role.ADMIN)
        return User.objects.all()
    
    @action(detail=True, methods=['patch'], url_path='block')
    def block(self, request, pk=None):
        user = self.get_object()
        user.is_active = not user.is_active
        user.save()
        return Response(UserSerializer(user).data)