export interface Pedido {
    id: string;
    idCliente: string;
    idUsuario: string;
    fechaHoraPedido: string;
    metodoPago: string;
    observaciones: string;
    total: number;
}
