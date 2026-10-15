# Motivos válidos por tipo de movimiento.
# Los nombres deben coincidir exactamente con la tabla motivo.

MOTIVOS_POR_TIPO  = {
    'ingreso': ['Compra a proveedor', 
                'Devolucion de cliente',
                'Reconteo de inventario',
                'Producto encontrado',
                'Producto dañado',
                'Error de carga',
                'Perdida',
                'Venta'
                ]
}

def nombres_motivos(tipo):
    return MOTIVOS_POR_TIPO.get((tipo or '').lower(), [])
