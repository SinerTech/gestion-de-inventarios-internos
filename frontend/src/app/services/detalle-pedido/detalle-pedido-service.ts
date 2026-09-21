import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { DetallePedido } from '../../models/detalle-pedido.models';

@Injectable({
    providedIn: 'root'
})
export class DetallePedidoService {
    private url = 'http://localhost:3000/detalles-pedido';
    private httpClient = inject(HttpClient);

    registrarDetalle(
    detalle: Omit<DetallePedido, 'id'>
    ): Observable<DetallePedido> {
    return this.httpClient.post<DetallePedido>(this.url, detalle).pipe(
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