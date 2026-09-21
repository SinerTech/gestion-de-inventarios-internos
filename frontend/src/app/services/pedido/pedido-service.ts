import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Pedido } from '../../models/pedido.models';

@Injectable({
    providedIn: 'root'
})
export class PedidoService {
    private url = 'http://localhost:3000/pedidos';
    private httpClient = inject(HttpClient);

    registrarPedido(pedido: Omit<Pedido, 'id'>): Observable<Pedido> {
    return this.httpClient.post<Pedido>(this.url, pedido).pipe(
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