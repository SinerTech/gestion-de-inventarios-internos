
from rest_framework import serializers
from .models import Producto


class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = [
            'id_producto',
            'sku',
            'nombre_producto',
            'id_categoria',
            'precio_unitario',
            'cantidad_existente',
            'estado',
        ]
        read_only_fields = ['id_producto']
