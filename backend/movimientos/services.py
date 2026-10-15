from django.db import transaction
from django.utils import timezone
from .models import MovimientoInventario, TipoMovimiento
from inventario.services import actualizar_stock

@transaction.atomic
def registrar_ingreso(data):
    producto = data['id_producto']
    
    try:
        tipo_ingreso = TipoMovimiento.objects.get(nombre_tipo_movimiento__iexact='Ingreso')
    except TipoMovimiento.DoesNotExist:
        raise ValueError("El tipo de movimiento 'Ingreso' no existe en la base de datos.")
    
    movimiento = MovimientoInventario.objects.create(
        id_producto = producto,
        id_usuario = data['id_usuario'],
        id_proveedor = data['id_proveedor'],
        id_motivo = data['id_motivo'],
        id_tipo_movimiento = tipo_ingreso,
        cantidad_movimiento = data['cantidad_movimiento'],
        fecha_hora_movimiento = timezone.now(),
        observaciones = data.get('observaciones', ''),
        numero_lote_factura = data['numero_lote_factura']
    )
    
    producto_actualizado = actualizar_stock(producto.pk, data['cantidad_movimiento'])
    
    return producto_actualizado
    