from django.db import transaction
from django.utils import timezone
from .models import MovimientoInventario, TipoMovimiento
from inventario.services import actualizar_stock
from .constantes import OPERACION_AJUSTE_POR_MOTIVO, nombres_motivos


def _obtener_tipo_movimiento(nombre):
    try:
        return TipoMovimiento.objects.get(nombre_tipo_movimiento__iexact=nombre)
    except TipoMovimiento.DoesNotExist:
        raise ValueError(f"El tipo de movimiento '{nombre}' no existe en la base de datos.")


def _registrar_movimiento(data, tipo_nombre, operacion):
    producto = data['id_producto']
    motivo = data['id_motivo']
    
    if motivo.nombre_motivo not in nombres_motivos(tipo_nombre):
        raise ValueError(
            f"El motivo '{motivo.nombre_motivo}' no corresponde a un movimiento de tipo {tipo_nombre.lower()}."
        )

    campos = {
        'id_producto': producto,
        'id_usuario': data['id_usuario'],
        'id_motivo': data['id_motivo'],
        'id_tipo_movimiento': _obtener_tipo_movimiento(tipo_nombre),
        'cantidad_movimiento': data['cantidad_movimiento'],
        'fecha_hora_movimiento': timezone.now(),
        'observaciones': data.get('observaciones') or '',
    }

    if tipo_nombre == 'Ingreso':
        campos['id_proveedor'] = data.get('id_proveedor')
        campos['numero_lote_factura'] = data.get('numero_lote_factura') or None

    MovimientoInventario.objects.create(**campos)

    return actualizar_stock(producto.pk, data['cantidad_movimiento'], operacion)


@transaction.atomic
def registrar_ingreso(data):
    return _registrar_movimiento(data, tipo_nombre='Ingreso', operacion='sumar')


@transaction.atomic
def registrar_ajuste(data):
    nombre_motivo = data['id_motivo'].nombre_motivo
    operacion = OPERACION_AJUSTE_POR_MOTIVO.get(nombre_motivo)

    if operacion is None:
        raise ValueError("El motivo no corresponde a un ajuste de inventario.")

    return _registrar_movimiento(data, tipo_nombre='Ajuste', operacion=operacion)

@transaction.atomic
def registrar_salida(data):
    return _registrar_movimiento(
        data,
        tipo_nombre='Salida',
        operacion='restar'
    )
