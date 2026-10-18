from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Producto
from .serializers import ProductoSerializer


class ProductoListView(APIView):
    def get(self, request):
        productos = Producto.objects.select_related('id_categoria').order_by('nombre_producto')
        return Response(ProductoSerializer(productos, many=True).data)