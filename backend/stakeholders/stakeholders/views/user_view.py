import json
import logging
import os
import urllib.request

from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action
from django.contrib.auth import get_user_model

from stakeholders.models import user
from stakeholders.serializers.user_serializer import UserSerializer
from permissions import IsAdminRole

logger = logging.getLogger(__name__)
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

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        self.sync_user_to_followers(user)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def sync_user_to_followers(self, user):
        url = os.getenv('FOLLOWERS_SYNC_URL', 'http://followers:8081/api/followers/sync')
        payload = json.dumps({'id': str(user.id), 'username': user.username}).encode('utf-8')
        request = urllib.request.Request(
            url,
            data=payload,
            headers={'Content-Type': 'application/json'},
            method='POST'
        )

        try:
            with urllib.request.urlopen(request, timeout=10) as response:
                if response.status not in (200, 201):
                    logger.warning('Followers sync returned status %s for user %s', response.status, user.id)
        except Exception:
            logger.exception('Failed to sync new user %s with followers service', user.id)

    @action(detail=True, methods=['patch'], url_path='block')
    def block(self, request, pk=None):
        user = self.get_object()
        user.is_active = not user.is_active
        user.save()
        return Response(UserSerializer(user).data)