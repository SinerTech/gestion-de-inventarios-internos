from django.db import models


class Motivo(models.Model):
    id_motivo = models.AutoField(primary_key=True)
    nombre_motivo = models.CharField(max_length=50)

    class Meta:
        managed = True
        db_table = 'motivo'

    def __str__(self):
        return self.nombre_motivo


class TipoMovimiento(models.Model):
    id_tipo_movimiento = models.AutoField(primary_key=True)
    nombre_tipo_movimiento = models.CharField(max_length=50)

    class Meta:
        managed = True
        db_table = 'tipo_movimiento'

    def __str__(self):
        return self.nombre_tipo_movimiento


class MovimientoInventario(models.Model):
    id_movimiento = models.AutoField(primary_key=True)
    id_producto = models.ForeignKey(
        'inventario.Producto',
        models.DO_NOTHING,
        db_column='id_producto'
    )
    id_usuario = models.ForeignKey(
        'usuarios.Usuario',
        models.DO_NOTHING,
        db_column='id_usuario'
    )
    id_proveedor = models.ForeignKey(
        'inventario.Proveedor',
        models.DO_NOTHING,
        db_column='id_proveedor',
        blank=True,
        null=True
    )
    id_motivo = models.ForeignKey(
        'movimientos.Motivo',
        models.DO_NOTHING,
        db_column='id_motivo'
    )
    id_tipo_movimiento = models.ForeignKey(
        'movimientos.TipoMovimiento',
        models.DO_NOTHING,
        db_column='id_tipo_movimiento'
    )
    cantidad_movimiento = models.IntegerField()
    fecha_hora_movimiento = models.DateTimeField()
    numero_lote_factura = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )
    observaciones = models.TextField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'movimiento_inventario'
        indexes = [
            models.Index(
                fields=['id_producto'],
                name='idx_movimiento_producto'
            ),
            models.Index(
                fields=['id_usuario'],
                name='idx_movimiento_usuario'
            ),
            models.Index(
                fields=['id_tipo_movimiento'],
                name='idx_movimiento_tipo'
            ),
            models.Index(
                fields=['fecha_hora_movimiento'],
                name='idx_movimiento_fecha'
            ),
        ]

    def __str__(self):
        fecha_str = (
            self.fecha_hora_movimiento.strftime('%d/%m/%Y %H:%M')
            if self.fecha_hora_movimiento
            else "Sin fecha"
        )
        return f"[{self.id_tipo_movimiento}] Producto: {self.id_producto} - {fecha_str}"
