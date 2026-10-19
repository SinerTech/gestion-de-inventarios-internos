# Motivos válidos por tipo de movimiento.
# Los nombres deben coincidir exactamente con la tabla motivo.

MOTIVOS_POR_TIPO  = {
    'ingreso': [
        'Compra a proveedor',
        'Devolucion de cliente'
    ],
    'ajuste': [
        'Reconteo de inventario',
        'Producto encontrado',
        'Producto dañado',
        'Error de carga',
        'Perdida',
    ],
    'salida': [
        'Venta'
    ]
}

OPERACION_AJUSTE_POR_MOTIVO = {
    'Producto encontrado': 'sumar',
    'Reconteo de inventario': 'sumar',
    'Producto dañado': 'restar',
    'Error de carga': 'restar',
    'Perdida': 'restar',
}

def nombres_motivos(tipo):
    return MOTIVOS_POR_TIPO.get((tipo or '').lower(), [])
