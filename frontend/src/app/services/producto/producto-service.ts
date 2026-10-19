import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { inject, Injectable } from '@angular/core';

import { catchError, map, Observable, throwError } from 'rxjs';

import { Producto } from '../../models/producto.models';

import { ProductoApi } from '../../models/producto-api.models';

@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  private url = 'http://localhost:8000/api/v1/productos/';

  private httpClient = inject(HttpClient);
  
  private adaptarProducto(producto: ProductoApi): Producto {
    return {
      id: String(producto.id_producto),
      sku: producto.sku,
      nombreProducto: producto.nombre_producto,
      idCategoria: String(producto.id_categoria),
      precioUnitario: Number(producto.precio_unitario),
      cantidadExistente: producto.cantidad_existente,
      estado: producto.estado,
      ultimoIngreso: '',
    };
  }


  // =====================================================
  // OBTENER PRODUCTOS
  // =====================================================

  obtenerListaProductos(): Observable<Producto[]> {
    return this.httpClient.get<ProductoApi[]>(this.url).pipe(
     map((productos) => productos.map((producto) => this.adaptarProducto(producto))),
     catchError(this.handleError),
   );
  }

  // =====================================================
  // ACTUALIZAR PRODUCTO
  // =====================================================

  actualizarCantidadExistente(id: string, producto: Producto): Observable<Producto> {
    return this.httpClient
      .put<Producto>(`${this.url}${id}/`, producto)
      .pipe(catchError(this.handleError));
  }

  actualizarProducto(id: string, producto: Producto): Observable<Producto> {
    return this.httpClient
      .put<Producto>(`${this.url}${id}/`, producto)
      .pipe(catchError(this.handleError));
  }

  // =====================================================
  // REGISTRAR PRODUCTO
  // =====================================================

  registrarProducto(producto: Producto): Observable<Producto> {
    return this.httpClient.post<Producto>(this.url, producto).pipe(catchError(this.handleError));
  }

  // =====================================================
  // ELIMINAR PRODUCTO
  // =====================================================

  eliminarProducto(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.url}${id}/`).pipe(catchError(this.handleError));
  }

  // =====================================================
  // MANEJO DE ERRORES
  // =====================================================

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('Ocurrió un error del lado del cliente:', error.error);
    } else {
      console.error(`El backend devolvió el código ${error.status}:`, error.error);
    }

    return throwError(() => new Error('Ocurrió un error. Intente nuevamente más tarde.'));
  }
}
