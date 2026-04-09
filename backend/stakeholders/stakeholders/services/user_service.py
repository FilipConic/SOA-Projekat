# stakeholders/services/user_service.py
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError

User = get_user_model()


class UserService:
    @staticmethod
    def register_user(username: str, email: str, password: str, role: str):

        role = role.lower()
        if role not in [User.Role.GUIDE, User.Role.TOURIST]:
            raise ValidationError("Invalid role. Only 'guide' or 'tourist' allowed.")

        if User.objects.filter(username=username).exists():
            raise ValidationError("Username already exists.")

        if User.objects.filter(email=email).exists():
            raise ValidationError("Email already exists.")

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            role=role
        )
        return user

    @staticmethod
    def get_all_non_admin_users():
        return User.objects.all()

    @staticmethod
    def get_user_by_id(user_id: int):
        
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            raise ValidationError("User not found")