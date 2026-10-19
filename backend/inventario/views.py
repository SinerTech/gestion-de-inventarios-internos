
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Categoria, Producto, Proveedor, ProductoProveedor
from .serializers import (
    CategoriaSerializer,
    ProductoSerializer,
    ProveedorSerializer,
    ProductoProveedorSerializer,
)


class CategoriaListView(generics.ListAPIView):
    queryset = Categoria.objects.all().order_by("id_categoria")
    serializer_class = CategoriaSerializer


class ProductoListCreateView(generics.ListCreateAPIView):
    queryset = Producto.objects.select_related("id_categoria").all().order_by(
        "id_producto"
    )
    serializer_class = ProductoSerializer


class ProductoDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Producto.objects.select_related("id_categoria").all()
    serializer_class = ProductoSerializer
    lookup_field = "id_producto"


class ProveedorListCreateView(generics.ListCreateAPIView):
    queryset = Proveedor.objects.all().order_by("id_proveedor")
    serializer_class = ProveedorSerializer


class ProveedorDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Proveedor.objects.all()
    serializer_class = ProveedorSerializer
    lookup_field = "id_proveedor"


class ProductoProveedorListCreateView(generics.ListCreateAPIView):
    queryset = ProductoProveedor.objects.select_related(
        "id_producto", "id_proveedor"
    ).all()
    serializer_class = ProductoProveedorSerializer


class ProductoProveedorDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ProductoProveedor.objects.all()
    serializer_class = ProductoProveedorSerializer
    lookup_field = "id_producto_proveedor"


class ProductoListView(APIView):
    def get(self, request):
        productos = Producto.objects.select_related('id_categoria').order_by('nombre_producto')
        return Response(ProductoSerializer(productos, many=True).data)
