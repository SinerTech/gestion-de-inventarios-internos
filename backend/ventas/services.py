from decimal import Decimal

from django.db import transaction
from django.utils import timezone
from rest_framework import serializers

from inventario.models import Producto
from usuarios.models import Usuario
from movimientos.models import Motivo
from movimientos.services import registrar_salida
from .models import Cliente, Pedido, DetallePedido


@transaction.atomic
def registrar_venta(data):
    detalles = data.pop("detalles")

    cliente_id = data["id_cliente_id"]
    usuario_id = data["id_usuario_id"]

    try:
        cliente = Cliente.objects.get(pk=cliente_id, activo=True)
    except Cliente.DoesNotExist:
        raise serializers.ValidationError(
            {"id_cliente": "El cliente no existe o está inactivo."}
        )

    try:
        usuario = Usuario.objects.get(pk=usuario_id, activo=True)
    except Usuario.DoesNotExist:
        raise serializers.ValidationError(
            {"id_usuario": "El usuario no existe o está inactivo."}
        )

    try:
        motivo_venta = Motivo.objects.get(nombre_motivo__iexact="Venta")
    except Motivo.DoesNotExist:
        raise serializers.ValidationError(
            {"movimientos": "No existe el motivo de movimiento 'Venta'."}
        )

    total = Decimal("0.00")
    detalles_validados = []

    for detalle in detalles:
        producto_id = detalle["id_producto_id"]
        cantidad = detalle["cantidad"]

        try:
            producto = Producto.objects.select_for_update().get(
                pk=producto_id,
                estado="Activo",
            )
        except Producto.DoesNotExist:
            raise serializers.ValidationError(
                {"detalles": f"El producto {producto_id} no existe o está inactivo."}
            )

        if producto.cantidad_existente < cantidad:
            raise serializers.ValidationError(
                {"detalles": f"Stock insuficiente para {producto.nombre_producto}."}
            )

        precio = producto.precio_unitario
        total += precio * cantidad

        detalles_validados.append({
            "producto": producto,
            "cantidad": cantidad,
            "precio": precio,
        })

    pedido = Pedido.objects.create(
        id_cliente=cliente,
        id_usuario=usuario,
        fecha_hora_pedido=data.get("fecha_hora_pedido") or timezone.now(),
        metodo_pago=data["metodo_pago"],
        observaciones=data.get("observaciones"),
        total=total,
    )

    for detalle in detalles_validados:
        DetallePedido.objects.create(
            id_pedido=pedido,
            id_producto=detalle["producto"],
            cantidad=detalle["cantidad"],
            precio_unitario=detalle["precio"],
        )

        registrar_salida({
            "id_producto": detalle["producto"],
            "id_usuario": usuario,
            "id_motivo": motivo_venta,
            "cantidad_movimiento": detalle["cantidad"],
            "observaciones": f"Venta #{pedido.pk}",
        })

    return pedido
