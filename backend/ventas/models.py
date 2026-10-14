from django.db import models


class MetodoPago(models.TextChoices):
    EFECTIVO = 'Efectivo', 'Efectivo'
    TARJETA_DEBITO = 'Tarjeta Débito', 'Tarjeta Débito'
    TARJETA_CREDITO = 'Tarjeta Crédito', 'Tarjeta Crédito'
    CODIGO_QR = 'Código QR', 'Código QR'
    TRANSFERENCIA = 'Transferencia', 'Transferencia'


class Cliente(models.Model):
    id_cliente = models.AutoField(primary_key=True)
    nombre_cliente = models.CharField(max_length=60)
    apellido_cliente = models.CharField(max_length=60)
    telefono_cliente = models.CharField(
        max_length=20,
        blank=True,
        null=True
    )
    email_cliente = models.EmailField(
        unique=True,
        max_length=100,
        blank=True,
        null=True
    )
    activo = models.BooleanField(default=True)

    class Meta:
        managed = True
        db_table = 'cliente'

    def __str__(self):
        return f"{self.id_cliente} ({self.nombre_cliente})"


class Pedido(models.Model):
    id_pedido = models.AutoField(primary_key=True)
    id_cliente = models.ForeignKey(
        'ventas.Cliente',
        models.DO_NOTHING,
        db_column='id_cliente'
    )
    id_usuario = models.ForeignKey(
        'usuarios.Usuario',
        models.DO_NOTHING,
        db_column='id_usuario'
    )
    fecha_hora_pedido = models.DateTimeField()
    metodo_pago = models.CharField(
        max_length=15,
        choices=MetodoPago.choices,
        default=MetodoPago.EFECTIVO
    )
    observaciones = models.TextField(blank=True, null=True)
    total = models.DecimalField(max_digits=12, decimal_places=2)

    class Meta:
        managed = True
        db_table = 'pedido'
        indexes = [
            models.Index(
                fields=['id_cliente'],
                name='idx_pedido_cliente'
            ),
            models.Index(
                fields=['id_usuario'],
                name='idx_pedido_usuario'
            ),
        ]

    def __str__(self):
        return f"Pedido #{self.id_pedido}"


class DetallePedido(models.Model):
    id_detalle_pedido = models.AutoField(primary_key=True)
    id_pedido = models.ForeignKey(
        'ventas.Pedido',
        models.DO_NOTHING,
        db_column='id_pedido'
    )
    id_producto = models.ForeignKey(
        'inventario.Producto',
        models.DO_NOTHING,
        db_column='id_producto'
    )
    cantidad = models.IntegerField()
    precio_unitario = models.DecimalField(max_digits=12, decimal_places=2)

    class Meta:
        managed = True
        db_table = 'detalle_pedido'
        indexes = [
            models.Index(
                fields=['id_pedido'],
                name='idx_detalle_pedido_pedido'
            ),
            models.Index(
                fields=['id_producto'],
                name='idx_detalle_pedido_producto'
            ),
        ]

    def __str__(self):
        return (
            f"Detalle #{self.id_detalle_pedido} "
            f"(Pedido: {self.id_pedido_id}, Producto: {self.id_producto_id})"
        )
