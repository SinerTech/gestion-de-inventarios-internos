export interface Pedido {
    idPedido: number;
    idCliente: number;
    idUsuario: number;
    fechaHoraPedido: string;
    metodoPago: string;
    observaciones: string;
    total: number;
}
