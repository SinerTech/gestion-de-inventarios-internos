from rest_framework import serializers
from decimal import Decimal
from .models import Pedido, DetallePedido
from .models import Cliente


class DetallePedidoSerializer(serializers.ModelSerializer):
    id_producto = serializers.IntegerField(
        source="id_producto_id",
        min_value=1
    )
    cantidad = serializers.IntegerField(min_value=1)
    precio_unitario = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
        min_value=Decimal("0.01")
    )

    class Meta:
        model = DetallePedido
        fields = [
            "id_producto",
            "cantidad",
            "precio_unitario",
        ]


class PedidoSerializer(serializers.ModelSerializer):
    id_cliente = serializers.IntegerField(
        source="id_cliente_id",
        min_value=1
    )
    id_usuario = serializers.IntegerField(
        source="id_usuario_id",
        min_value=1
    )
    detalles = DetallePedidoSerializer(many=True, write_only=True)

    class Meta:
        model = Pedido
        fields = [
            "id_pedido",
            "id_cliente",
            "id_usuario",
            "fecha_hora_pedido",
            "metodo_pago",
            "observaciones",
            "total",
            "detalles",
        ]
        read_only_fields = ["id_pedido", "total"]

    def validate_detalles(self, detalles):
        if not detalles:
            raise serializers.ValidationError(
                "La venta debe incluir al menos un producto."
            )
        return detalles


class ClienteSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source="id_cliente", read_only=True)
    nombreCliente = serializers.CharField(
        source="nombre_cliente",
        read_only=True
    )
    apellidoCliente = serializers.CharField(
        source="apellido_cliente",
        read_only=True
    )
    telefonoCliente = serializers.CharField(
        source="telefono_cliente",
        read_only=True,
        allow_null=True
    )
    emailCliente = serializers.EmailField(
        source="email_cliente",
        read_only=True,
        allow_null=True
    )

    class Meta:
        model = Cliente
        fields = [
            "id",
            "nombreCliente",
            "apellidoCliente",
            "telefonoCliente",
            "emailCliente",
        ]