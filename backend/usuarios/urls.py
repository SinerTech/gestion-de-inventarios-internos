from django.urls import path
from .views import (
    UsuarioView,
    RolView,
    LoginView,
)

urlpatterns = [
    path('usuarios/', UsuarioView.as_view(), name='usuarios'),
    path('roles/', RolView.as_view(), name='roles'),
    path('login/', LoginView.as_view(), name='login'),
]
