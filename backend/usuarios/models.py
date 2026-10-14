from django.db import models


class Rol(models.Model):
    id_rol = models.AutoField(primary_key=True)
    nombre_rol = models.CharField(max_length=50)

    class Meta:
        managed = True
        db_table = 'rol'

    def __str__(self):
        return self.nombre_rol


class Usuario(models.Model):
    id_usuario = models.AutoField(primary_key=True)
    nombre_usuario = models.CharField(max_length=50)
    apellido_usuario = models.CharField(max_length=50)
    id_rol = models.ForeignKey(
        'usuarios.Rol',
        models.DO_NOTHING,
        db_column='id_rol'
    )
    email_usuario = models.EmailField(max_length=100, unique=True)
    activo = models.BooleanField(default=True)
    password = models.CharField(max_length=128)

    class Meta:
        managed = True
        db_table = 'usuario'
        indexes = [
            models.Index(
                fields=['nombre_usuario'],
                name='idx_usuario_nombre'
            ),
            models.Index(
                fields=['apellido_usuario'],
                name='idx_usuario_apellido'
            ),
            models.Index(
                fields=['activo'],
                name='idx_usuario_activo'
            ),
        ]

    def __str__(self):
        return f"{self.nombre_usuario} {self.apellido_usuario} ({self.email_usuario})"
