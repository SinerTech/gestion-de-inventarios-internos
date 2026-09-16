export interface MovimientoInventario {
    id?: string;
    idProducto: string;
    idUsuario: string;
    idProveedor?: string;
    idMotivo: string;
    idTipoMovimiento: string;
    cantidadMovimiento: number;
    fechaHoraMovimiento: string;
    observaciones: string;
    numeroLoteFactura?: string;
}
