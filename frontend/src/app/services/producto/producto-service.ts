import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Producto } from '../../models/producto.models';

@Injectable({
    providedIn: 'root'
})
export class ProductoService {
    url = "http://localhost:3000/productos"
    private httpClient = inject(HttpClient)
    
    obtenerListaProductos():Observable<Producto[]> {
        return this.httpClient.get<Producto[]>(this.url).pipe(
            catchError(this.handleError)
        )
    }

    actualizarCantidadExistente(id: string, producto: Producto): Observable<Producto> {
        return this.httpClient.put<Producto>(`${this.url}/${id}`, producto).pipe(
            catchError(this.handleError)
        )
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
