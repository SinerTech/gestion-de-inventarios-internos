export interface Cliente {
    idCliente: number;
    nombreCliente: string;
    apellidoCliente: string;
    telefonoCliente: string;
    emailCliente: string;
}

export interface Clientes {
    clientes: Cliente[];
}