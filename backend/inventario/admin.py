
from django.contrib import admin

from .models import Categoria, Producto, Proveedor, ProductoProveedor


@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ("id_categoria", "nombre_categoria")
    search_fields = ("nombre_categoria",)


@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    list_display = (
        "id_producto",
        "sku",
        "nombre_producto",
        "id_categoria",
        "precio_unitario",
        "cantidad_existente",
        "estado",
    )
    search_fields = ("sku", "nombre_producto")
    list_filter = ("estado", "id_categoria")


@admin.register(Proveedor)
class ProveedorAdmin(admin.ModelAdmin):
    list_display = (
        "id_proveedor",
        "razon_social",
        "cuit",
        "telefono_proveedor",
        "email_proveedor",
        "activo",
    )
    search_fields = ("razon_social", "cuit")
    list_filter = ("activo",)


@admin.register(ProductoProveedor)
class ProductoProveedorAdmin(admin.ModelAdmin):
    list_display = (
        "id_producto_proveedor",
        "id_producto",
        "id_proveedor",
    )
    list_filter = ("id_proveedor",)
    search_fields = (
        "id_producto__nombre_producto",
        "id_proveedor__razon_social",
    )
