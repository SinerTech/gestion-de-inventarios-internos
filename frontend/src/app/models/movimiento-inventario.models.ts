export interface MovimientoInventario {
    idMovimiento: number;
    idProducto: number;
    idUsuario: number;
    idProveedor: number;
    idMotivo: number;
    idTipoMovimiento: number;
    cantidadMovimiento: number;
    fechaHoraMovimiento: string;
    observaciones: string;
    numeroLoteFactura: string;
}

export interface MovimientosInventario {
    movimientosInventario: MovimientoInventario[];
}