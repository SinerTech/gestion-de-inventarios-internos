export interface DetallePedido {
    idDetallePedido: number;
    idPedido: number;
    idProducto: number;
    cantidad: number;
    precioUnitario: number;
}

export interface DetallesPedido {
    detallesPedido: DetallePedido[];
}