
export interface ProductoApi {
  id_producto: number;
  sku: string;
  nombre_producto: string;
  id_categoria: number;
  precio_unitario: string | number;
  cantidad_existente: number;
  estado: 'Activo' | 'Inactivo' | 'Suspendido';
}
