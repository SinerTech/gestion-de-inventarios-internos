from rest_framework import serializers
from inventario.models import Producto, Proveedor, EstadoProducto
from usuarios.models import Usuario
from .models import Motivo, TipoMovimiento
from .constantes import nombres_motivos

class MotivoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Motivo
        fields = ['id_motivo', 'nombre_motivo']

class MovimientoStockSerializer(serializers.Serializer):
    id_producto = serializers.PrimaryKeyRelatedField(queryset=Producto.objects.all())
    cantidad_movimiento = serializers.IntegerField(min_value=1, max_value=200)
    id_motivo = serializers.PrimaryKeyRelatedField(queryset=Motivo.objects.all())
    observaciones = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    id_usuario = serializers.PrimaryKeyRelatedField(queryset=Usuario.objects.filter(activo=True))

class IngresoSerializer(MovimientoStockSerializer):
    id_proveedor = serializers.PrimaryKeyRelatedField(queryset=Proveedor.objects.all(), required=False, allow_null=True)
    numero_lote_factura = serializers.CharField(max_length=100, required=False, allow_blank=True, allow_null=True)

    def validate_id_motivo(self, motivo):
        if motivo.nombre_motivo not in nombres_motivos('ingreso'):
            raise serializers.ValidationError("El motivo no corresponde a un ingreso.")
        return motivo

    def validate(self, attrs):
        motivo = attrs['id_motivo'].nombre_motivo
        if motivo == 'Compra a proveedor':
            if not attrs.get('id_proveedor'):
                raise serializers.ValidationError({'id_proveedor': 'El proveedor es obligatorio para una compra.'})
            if not attrs.get('numero_lote_factura'):
                raise serializers.ValidationError({'numero_lote_factura': 'La factura o número de lote es obligatorio para una compra.'})
        return attrs

class AjusteSerializer(MovimientoStockSerializer):
    def validate_id_motivo(self, motivo):
        if motivo.nombre_motivo not in nombres_motivos('ajuste'):
            raise serializers.ValidationError("El motivo no corresponde a un ajuste.")
        return motivo
    