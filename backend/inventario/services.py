from django.db import transaction
from .models import Producto


@transaction.atomic
def actualizar_stock(id_producto: int, cantidad: int, operacion: str) -> Producto:
    try:
        producto = Producto.objects.select_for_update().get(pk=id_producto)
    except Producto.DoesNotExist:
        raise ValueError(f"El producto con ID {id_producto} no existe en el inventario.")

    if operacion == 'sumar':
        producto.cantidad_existente += cantidad
    elif operacion == 'restar':
        if producto.cantidad_existente < cantidad:
            raise ValueError("Stock insuficiente para realizar el ajuste.")
        producto.cantidad_existente -= cantidad
    else:
        raise ValueError("La operación de stock no es válida.")

    producto.save(update_fields=['cantidad_existente'])
    return producto
