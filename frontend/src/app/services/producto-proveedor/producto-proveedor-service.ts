import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, Service } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { ProductoProveedor } from '../../models/producto-proveedor';

@Injectable({
    providedIn: 'root'
})
export class ProductoProveedorService {
    url = "http://localhost:3000/productos-proveedores"
    private httpClient = inject(HttpClient)

    obtenerProductosProveedores():Observable<ProductoProveedor[]> {
        return this.httpClient.get<ProductoProveedor[]>(this.url).pipe(
            catchError(this.handleError)
        )
    }

    registrarRelacion(relacion: ProductoProveedor):Observable<ProductoProveedor> {
        return this.httpClient.post<ProductoProveedor>(this.url, relacion).pipe(
            catchError(this.handleError)
        );
    }

    private handleError(error: HttpErrorResponse) {
        if (error.status === 0) {
            console.error('Ocurrió un error del lado del cliente:', error.error);
        } else {
            console.error(
                `El backend devolvió el código ${error.status}:`,
                error.error
            );
        }
        return throwError(
            () => new Error('Ocurrió un error. Intente nuevamente más tarde.')
        );
    }
}
