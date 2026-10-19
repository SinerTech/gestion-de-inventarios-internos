
from rest_framework import serializers
from .models import Categoria, Producto, Proveedor, ProductoProveedor


class CategoriaSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source="id_categoria", read_only=True)
    nombreCategoria = serializers.CharField(source="nombre_categoria")

    class Meta:
        model = Categoria
        fields = ["id", "nombreCategoria"]


class ProductoSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source="id_producto", read_only=True)
    nombreProducto = serializers.CharField(source="nombre_producto")
    idCategoria = serializers.PrimaryKeyRelatedField(
        source="id_categoria",
        queryset=Categoria.objects.all()
    )
    precioUnitario = serializers.DecimalField(
        source="precio_unitario",
        max_digits=12,
        decimal_places=2
    )
    cantidadExistente = serializers.IntegerField(
        source="cantidad_existente"
    )

    class Meta:
        model = Producto
        fields = [
            "id",
            "sku",
            "nombreProducto",
            "idCategoria",
            "precioUnitario",
            "cantidadExistente",
            "estado",
        ]


class ProveedorSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source="id_proveedor", read_only=True)
    razonSocial = serializers.CharField(source="razon_social")
    telefonoProveedor = serializers.CharField(
        source="telefono_proveedor",
        required=False,
        allow_blank=True,
        allow_null=True
    )
    emailProveedor = serializers.CharField(
        source="email_proveedor",
        required=False,
        allow_blank=True,
        allow_null=True
    )

    class Meta:
        model = Proveedor
        fields = [
            "id",
            "razonSocial",
            "cuit",
            "telefonoProveedor",
            "emailProveedor",
        ]


class ProductoProveedorSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(
        source="id_producto_proveedor",
        read_only=True
    )
    idProducto = serializers.PrimaryKeyRelatedField(
        source="id_producto",
        queryset=Producto.objects.all()
    )
    idProveedor = serializers.PrimaryKeyRelatedField(
        source="id_proveedor",
        queryset=Proveedor.objects.all()
    )

    class Meta:
        model = ProductoProveedor
        fields = ["id", "idProducto", "idProveedor"]
