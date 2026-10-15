from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Motivo, TipoMovimiento
from .serializers import IngresoSerializer, MotivoSerializer, AjusteSerializer
from .services import registrar_ingreso, registrar_ajuste
from .constantes import nombres_motivos

class MotivoView(APIView):
    def get(self, request):
        motivos = Motivo.objects.order_by('nombre_motivo')
        tipo = request.query_params.get('tipo')
        if tipo:
            motivos = motivos.filter(nombre_motivo__in=nombres_motivos(tipo))
        return Response(MotivoSerializer(motivos, many=True).data)

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
        return Response({"mensaje": f"Se registro con exito el ingreso de stock del producto {producto.nombre_producto}"},
                        status=status.HTTP_200_OK)
        
class AjusteView(APIView):
    def post(self, request):
        serializer = AjusteSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        try:
            producto = registrar_ajuste(serializer.validated_data)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception:
            return Response({"error": "Ocurrió un error interno al registrar el ajuste."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({"mensaje": (f"Se registró con éxito el ajuste de stock del producto {producto.nombre_producto}")},
                        status=status.HTTP_200_OK)