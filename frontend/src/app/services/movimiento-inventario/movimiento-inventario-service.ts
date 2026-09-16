import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { MovimientoInventario } from '../../models/movimiento-inventario.models';

@Injectable({
    providedIn: 'root'
})
export class MovimientoInventarioService {
    url = "http://localhost:3000/movimientos-inventario"
    private httpClient = inject(HttpClient)

    obtenerMovimientosInventario():Observable<MovimientoInventario[]> {
        return this.httpClient.get<MovimientoInventario[]>(this.url).pipe(
            catchError(this.handleError)
        )
    }

    registrarMovimiento(movimiento: MovimientoInventario):Observable<MovimientoInventario> {
        return this.httpClient.post<MovimientoInventario>(this.url, movimiento).pipe(
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