export interface Producto {
    id: string;
    sku: string;
    nombreProducto: string;
    idCategoria: string;
    idProveedor: string;
    precioUnitario: number;
    cantidadExistente: number;
    estado: 'Activo' | 'Inactivo' | 'Suspendido'; 
    ultimoIngreso: string; 
    }
