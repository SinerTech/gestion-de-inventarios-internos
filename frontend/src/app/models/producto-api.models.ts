
export interface ProductoApi {
  id: number;
  sku: string;
  nombreProducto: string;
  idCategoria: number;
  precioUnitario: string | number;
  cantidadExistente: number;
  estado: 'Activo' | 'Inactivo' | 'Suspendido';
  ultimoIngreso: string | null;
}