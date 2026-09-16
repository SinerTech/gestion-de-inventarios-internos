import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Motivo } from '../../models/motivo.models';

@Injectable({
    providedIn: 'root'
})
export class MotivoService {
    url = "http://localhost:3000/motivos"
    private httpClient = inject(HttpClient)

    obtenerMotivos():Observable<Motivo[]> {
        return this.httpClient.get<Motivo[]>(this.url).pipe(
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
