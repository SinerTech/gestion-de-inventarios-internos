import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { inject, Injectable } from '@angular/core';

import { catchError, Observable, throwError } from 'rxjs';

import { ProductoProveedor } from '../../models/producto-proveedor';

@Injectable({
  providedIn: 'root',
})
export class ProductoProveedorService {
  private url = 'http://localhost:3000/productos-proveedores';

  private httpClient = inject(HttpClient);

  // =====================================================
  // OBTENER RELACIONES
  // =====================================================

  obtenerProductosProveedores(): Observable<ProductoProveedor[]> {
    return this.httpClient.get<ProductoProveedor[]>(this.url).pipe(catchError(this.handleError));
  }

  // =====================================================
  // REGISTRAR RELACIÓN
  // =====================================================

  registrarRelacion(relacion: ProductoProveedor): Observable<ProductoProveedor> {
    return this.httpClient
      .post<ProductoProveedor>(this.url, relacion)
      .pipe(catchError(this.handleError));
  }

  actualizarRelacion(id: string, relacion: ProductoProveedor): Observable<ProductoProveedor> {
    return this.httpClient
      .put<ProductoProveedor>(`${this.url}/${id}`, relacion)
      .pipe(catchError(this.handleError));
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
