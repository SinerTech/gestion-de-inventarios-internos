from django.contrib.auth.hashers import check_password, is_password_usable

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Usuario, Rol
from .serializers import UsuarioSerializer, RolSerializer


class UsuarioView(APIView):

    def get(self, request):
        usuarios = Usuario.objects.select_related('id_rol').order_by('id_usuario')
        serializer = UsuarioSerializer(usuarios, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = UsuarioSerializer(data=request.data)

        if serializer.is_valid():
            usuario = serializer.save()

            return Response(
                {
                    'mensaje': 'Usuario registrado correctamente.',
                    'usuario': serializer.data,
                },
                status=status.HTTP_201_CREATED,
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RolView(APIView):

    def get(self, request):
        roles = Rol.objects.all()
        serializer = RolSerializer(roles, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class LoginView(APIView):
    def post(self, request):
        email = request.data.get('email', '').strip().lower()
        password = request.data.get('password', '')

        if not email or not password:
            return Response(
                {'mensaje': 'Email y contraseña son obligatorios.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        usuario = Usuario.objects.select_related(
            'id_rol'
        ).filter(email_usuario=email).first()

        if usuario is None or not usuario.activo:
            return Response(
                {'mensaje': 'Credenciales incorrectas.'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        password_guardada = usuario.password

        if is_password_usable(password_guardada):
            es_valida = check_password(
                password,
                password_guardada
            )

            # Compatibilidad con contraseñas de prueba en texto plano.
            if not es_valida and password == password_guardada:
                es_valida = True
        else:
            es_valida = password == password_guardada

        if not es_valida:
            return Response(
                {'mensaje': 'Credenciales incorrectas.'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        datos_usuario = UsuarioSerializer(usuario).data

        return Response(
            {'usuario': datos_usuario},
            status=status.HTTP_200_OK
        )