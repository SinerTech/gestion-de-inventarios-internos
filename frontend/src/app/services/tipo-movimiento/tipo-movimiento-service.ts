import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TipoMovimiento } from '../../models/tipo-movimiento.models';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TipoMovimientoService {
    url = "http://localhost:3000/tipos-movimiento"
    private httpClient = inject(HttpClient)

    obtenerTiposMovimiento():Observable<TipoMovimiento[]> {
            return this.httpClient.get<TipoMovimiento[]>(this.url).pipe(
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
