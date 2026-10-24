from rest_framework import serializers
from .models import Usuario, Rol


class RolSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rol
        fields = ['id_rol', 'nombre_rol']


class UsuarioSerializer(serializers.ModelSerializer):
    rol = RolSerializer(source='id_rol', read_only=True)

    class Meta:
        model = Usuario
        fields = [
            'id_usuario',
            'nombre_usuario',
            'apellido_usuario',
            'email_usuario',
            'password',
            'id_rol',
            'rol',
            'activo',
        ]
        read_only_fields = ['id_usuario', 'id_rol', 'activo']
        extra_kwargs = {
            'password': {
                'write_only': True,
            },
        }

    def validate_email_usuario(self, value):
        return value.strip().lower()

    def validate_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError(
                'La contraseña debe tener al menos 8 caracteres.'
            )

        if not any(c.isupper() for c in value):
            raise serializers.ValidationError(
                'La contraseña debe contener al menos una mayúscula.'
            )

        if not any(c.islower() for c in value):
            raise serializers.ValidationError(
                'La contraseña debe contener al menos una minúscula.'
            )

        if not any(c.isdigit() for c in value):
            raise serializers.ValidationError(
                'La contraseña debe contener al menos un número.'
            )

        return value

    def create(self, validated_data):
        try:
            rol_vendedor = Rol.objects.get(nombre_rol='vendedor')
        except Rol.DoesNotExist:
            raise serializers.ValidationError({
                'rol': 'El rol vendedor no está configurado en el sistema.'
            })

        validated_data['id_rol'] = rol_vendedor
        return super().create(validated_data)