from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Motivo, TipoMovimiento
from .serializers import IngresoSerializer
from .services import registrar_ingreso

class IngresoView(APIView):
    def post(self, request):
        serializer = IngresoSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        try: 
            producto = registrar_ingreso(serializer.validated_data)
        except ValueError as e:
            return Response({"error": str(e)},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR,)
        except Exception:
            return Response({"error": "Ocurrio un error interno al registrar el ingreso."},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR,)
        return Response({"mensaje": f"Se registro con exito el stock del producto {producto.nombre_producto}"},
                        status=status.HTTP_200_OK)
