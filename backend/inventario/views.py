
from django.shortcuts import get_object_or_404
from rest_framework import generics

from .models import Producto
from .serializers import ProductoSerializer


class ProductoListView(generics.ListAPIView):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer


class ProductoDetailView(generics.RetrieveUpdateAPIView):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer
    lookup_field = 'id_producto'
