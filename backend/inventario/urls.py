
from django.urls import path

from .views import (
    CategoriaListView,
    ProductoListCreateView,
    ProductoDetailView,
    ProveedorListCreateView,
    ProveedorDetailView,
    ProductoProveedorListCreateView,
    ProductoProveedorDetailView,
)

urlpatterns = [
    path("categorias/", CategoriaListView.as_view(), name="categorias-lista"),

    path("productos/", ProductoListCreateView.as_view(), name="productos-lista"),
    path(
        "productos/<int:id_producto>/",
        ProductoDetailView.as_view(),
        name="productos-detalle",
    ),

    path("proveedores/", ProveedorListCreateView.as_view(),
         name="proveedores-lista"),
    path(
        "proveedores/<int:id_proveedor>/",
        ProveedorDetailView.as_view(),
        name="proveedores-detalle",
    ),

    path(
        "productos-proveedores/",
        ProductoProveedorListCreateView.as_view(),
        name="productos-proveedores-lista",
    ),
    path(
        "productos-proveedores/<int:id_producto_proveedor>/",
        ProductoProveedorDetailView.as_view(),
        name="productos-proveedores-detalle",
    ),
]
