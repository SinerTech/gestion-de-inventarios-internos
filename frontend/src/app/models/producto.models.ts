export interface Producto {
    idProducto: number;
    sku: string;
    nombreProducto: string;
    idCategoria: number;
    idProveedor: number;
    precioUnitario: number;
    cantidadExistente: number;
    estado: 'Activo' | 'Inactivo' | 'Suspendido'; 
    ultimoIngreso: string; 
    }
