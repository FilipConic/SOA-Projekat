"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView, TokenBlacklistView
from django.conf import settings
from django.conf.urls.static import static
from stakeholders.views.profile_view import ProfileViewSet
from stakeholders.views.auth_view import CustomTokenObtainPairView
from stakeholders.views.user_view import UserViewSet

urlpatterns = [
    path('api/admin/', admin.site.urls),
    path('api/auth/login/', CustomTokenObtainPairView.as_view()),
    path('api/auth/refresh/', TokenRefreshView.as_view()),
    path('api/auth/logout/', TokenBlacklistView.as_view()),
    path('api/users/', UserViewSet.as_view({'get': 'list', 'post': 'create'})),
    path('api/users/<uuid:pk>/', UserViewSet.as_view({'get': 'retrieve'})),
    path('api/users/<uuid:pk>/block/', UserViewSet.as_view({'patch': 'block'})),

    path('api/profiles/me/', ProfileViewSet.as_view({'get': 'me'})),
    path('api/profiles/me/avatar/', ProfileViewSet.as_view({'post': 'upload_avatar'})),
    path('api/profiles/me/update/', ProfileViewSet.as_view({'put': 'update_profile', 'patch': 'update_profile'})),
    path('api/profiles/get/<uuid:pk>/', ProfileViewSet.as_view({'get': 'get_profile'})),

    path('api/internal/user-info/<uuid:pk>/', ProfileViewSet.as_view({'get': 'get_user_info'})),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
