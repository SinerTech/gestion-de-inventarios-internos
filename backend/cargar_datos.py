
import os
import django
from decimal import Decimal

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from django.db import transaction
from inventario.models import Categoria, Producto, Proveedor, ProductoProveedor
from movimientos.models import Motivo, TipoMovimiento

with transaction.atomic():
    # 1. Categorías
    categorias = {}
    for antiguo_id, nombre in [
        ("1", "Categoría 1"),
        ("2", "Categoría 2"),
        ("3", "Categoría 3"),
    ]:
        obj, _ = Categoria.objects.get_or_create(
            nombre_categoria=nombre
        )
        categorias[antiguo_id] = obj

    # 2. Proveedores
    proveedores = {}
    datos_proveedores = [
        ("1", "Proveedor 1", "20-12345678-9",
         "011-1234-5678", "contacto@proveedor1.com"),
        ("3", "Proveedor 3", "20-34567890-1",
         "011-3456-7890", "contacto@proveedor3.com"),
        ("5", "Proveedor 5", "20-56789012-3",
         "011-5678-9012", "contacto@proveedor5.com"),
    ]

    for antiguo_id, razon, cuit, telefono, email in datos_proveedores:
        obj, _ = Proveedor.objects.get_or_create(
            cuit=cuit,
            defaults={
                "razon_social": razon,
                "telefono_proveedor": telefono,
                "email_proveedor": email,
                "activo": True,
            },
        )
        proveedores[antiguo_id] = obj

    # 3. Productos
    productos = {}
    datos_productos = [
        ("1", "PROD-001", "Producto 1", "1", "1500", 60, "Activo"),
        ("2", "PROD-002", "Producto 2", "1", "1750", 58, "Activo"),
        ("3", "PROD-003", "Producto 3", "2", "5500", 0, "Inactivo"),
        ("4", "PROD-004", "Producto 4", "3", "2050", 64, "Suspendido"),
    ]

    for antiguo_id, sku, nombre, cat_id, precio, stock, estado in datos_productos:
        obj, _ = Producto.objects.get_or_create(
            sku=sku,
            defaults={
                "nombre_producto": nombre,
                "id_categoria": categorias[cat_id],
                "precio_unitario": Decimal(precio),
                "cantidad_existente": stock,
                "estado": estado,
            },
        )
        productos[antiguo_id] = obj

    # 4. Relaciones entre productos y proveedores
    for producto_id, proveedor_id in [
        ("1", "1"),
        ("2", "1"),
        ("3", "5"),
        ("4", "3"),
    ]:
        ProductoProveedor.objects.get_or_create(
            id_producto=productos[producto_id],
            id_proveedor=proveedores[proveedor_id],
        )

    # 5. Tipos de movimiento
    for nombre in ["Ingreso", "Ajuste", "Salida"]:
        TipoMovimiento.objects.get_or_create(
            nombre_tipo_movimiento=nombre
        )

    # 6. Motivos
    for nombre in [
        "Compra a proveedor",
        "Devolucion de cliente",
        "Reconteo de inventario",
        "Producto encontrado",
        "Producto dañado",
        "Error de carga",
        "Perdida",
        "Venta",
    ]:
        Motivo.objects.get_or_create(nombre_motivo=nombre)

print("Carga finalizada.")
print("Categorías:", Categoria.objects.count())
print("Proveedores:", Proveedor.objects.count())
print("Productos:", Producto.objects.count())
print("Relaciones:", ProductoProveedor.objects.count())
print("Motivos:", Motivo.objects.count())
print("Tipos de movimiento:", TipoMovimiento.objects.count())
