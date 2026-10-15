from django.db import transaction
from .models import Producto

@transaction.atomic
def actualizar_stock(id_producto: int, cantidad_ingresada: int) -> Producto:
    try:
        producto = Producto.objects.select_for_update().get(pk=id_producto)
        producto.cantidad_existente += cantidad_ingresada
        producto.save()
    
        return producto
    except Producto.DoesNotExist:
        raise ValueError(f"El producto con ID {id_producto} no existe en el inventario.")