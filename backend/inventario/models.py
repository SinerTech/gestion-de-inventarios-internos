from django.db import models


class EstadoProducto(models.TextChoices):
    ACTIVO = 'Activo', 'Activo'
    INACTIVO = 'Inactivo', 'Inactivo'
    SUSPENDIDO = 'Suspendido', 'Suspendido'


class Categoria(models.Model):
    id_categoria = models.AutoField(primary_key=True)
    nombre_categoria = models.CharField(max_length=50)

    class Meta:
        managed = True
        db_table = 'categoria'

    def __str__(self):
        return self.nombre_categoria


class Producto(models.Model):
    id_producto = models.AutoField(primary_key=True)
    sku = models.CharField(unique=True, max_length=60)
    nombre_producto = models.CharField(max_length=100)
    id_categoria = models.ForeignKey(
        'inventario.Categoria',
        models.DO_NOTHING,
        db_column='id_categoria'
    )
    precio_unitario = models.DecimalField(max_digits=12, decimal_places=2)
    cantidad_existente = models.IntegerField(default=0)
    estado = models.CharField(
        max_length=10,
        choices=EstadoProducto.choices,
        default=EstadoProducto.ACTIVO
    )

    class Meta:
        managed = True
        db_table = 'producto'
        indexes = [
            models.Index(
                fields=['nombre_producto'],
                name='idx_producto_nombre'
            ),
            models.Index(
                fields=['id_categoria'],
                name='idx_producto_categoria'
            ),
        ]

    def __str__(self):
        return f"{self.nombre_producto} ({self.id_categoria})"


class Proveedor(models.Model):
    id_proveedor = models.AutoField(primary_key=True)
    razon_social = models.CharField(max_length=100)
    cuit = models.CharField(
        db_column='CUIT',
        unique=True,
        max_length=20
    )
    telefono_proveedor = models.CharField(
        max_length=20,
        blank=True,
        null=True
    )
    email_proveedor = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )
    activo = models.BooleanField(default=True)

    class Meta:
        managed = True
        db_table = 'proveedor'
        indexes = [
            models.Index(
                fields=['razon_social'],
                name='idx_proveedor_razonsocial'
            ),
        ]

    def __str__(self):
        return f"{self.razon_social} (CUIT: {self.cuit})"


class ProductoProveedor(models.Model):
    id_producto_proveedor = models.AutoField(primary_key=True)
    id_producto = models.ForeignKey(
        'inventario.Producto',
        models.DO_NOTHING,
        db_column='id_producto'
    )
    id_proveedor = models.ForeignKey(
        'inventario.Proveedor',
        models.DO_NOTHING,
        db_column='id_proveedor'
    )

    class Meta:
        managed = True
        db_table = 'producto_proveedor'
        unique_together = (('id_producto', 'id_proveedor'),)
        indexes = [
            models.Index(
                fields=['id_proveedor'],
                name='idx_pp_proveedor'
            ),
        ]

    def __str__(self):
        return f"Producto: {self.id_producto} - Proveedor: {self.id_proveedor}"
