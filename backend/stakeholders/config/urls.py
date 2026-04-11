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
    path('admin/', admin.site.urls),
    path('auth/login/', CustomTokenObtainPairView.as_view()),
    path('auth/refresh/', TokenRefreshView.as_view()),
    path('auth/logout/', TokenBlacklistView.as_view()),
    path('users/', UserViewSet.as_view({'get': 'list', 'post': 'create'})),
    path('users/<int:pk>/', UserViewSet.as_view({'get': 'retrieve'})),
    path('users/<int:pk>/block/', UserViewSet.as_view({'patch': 'block'})),

    path('profiles/me/', ProfileViewSet.as_view({'get': 'me'})),
    path('profiles/me/avatar/', ProfileViewSet.as_view({'post': 'upload_avatar'})),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
