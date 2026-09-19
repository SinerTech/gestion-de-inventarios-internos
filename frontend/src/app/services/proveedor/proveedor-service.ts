import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { inject, Injectable } from '@angular/core';

import { catchError, Observable, throwError } from 'rxjs';

import { Proveedor } from '../../models/proveedor.models';

@Injectable({
  providedIn: 'root',
})
export class ProveedorService {
  private url = 'http://localhost:3000/proveedores';

  private httpClient = inject(HttpClient);

  // =====================================================
  // OBTENER PROVEEDORES
  // =====================================================

  obtenerProveedores(): Observable<Proveedor[]> {
    return this.httpClient.get<Proveedor[]>(this.url).pipe(catchError(this.handleError));
  }

  // =====================================================
  // REGISTRAR PROVEEDOR
  // =====================================================

  registrarProveedor(proveedor: Proveedor): Observable<Proveedor> {
    return this.httpClient.post<Proveedor>(this.url, proveedor).pipe(catchError(this.handleError));
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
