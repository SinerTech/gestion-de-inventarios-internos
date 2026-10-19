from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Cliente
from .serializers import ClienteSerializer

from .serializers import PedidoSerializer
from .services import registrar_venta

class RegistrarVentaView(APIView):
    def post(self, request):
        serializer = PedidoSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        pedido = registrar_venta(serializer.validated_data)

        respuesta = PedidoSerializer(pedido)
        return Response(
            respuesta.data,
            status=status.HTTP_201_CREATED
        )


class ClienteListView(APIView):
    def get(self, request):
        clientes = Cliente.objects.filter(activo=True)
        serializer = ClienteSerializer(clientes, many=True)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )