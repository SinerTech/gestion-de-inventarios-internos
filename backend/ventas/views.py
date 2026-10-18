from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

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
