import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Motivo } from '../../models/motivo.models';

interface MotivoApi {
    id_motivo: number;
    nombre_motivo: string;
}

@Injectable({
    providedIn: 'root'
})
export class MotivoService {
    private readonly url = 'http://localhost:8000/api/v1/motivos/';
    private httpClient = inject(HttpClient);

    obtenerMotivos(): Observable<Motivo[]> {
        return this.httpClient.get<MotivoApi[]>(this.url).pipe(
            map(motivos => motivos.map(motivo => ({
                id: String(motivo.id_motivo),
                nombreMotivo: motivo.nombre_motivo
            }))),
            catchError(this.handleError)
        );
    }

    private handleError(error: HttpErrorResponse) {
        console.error(
            'Error al consultar los motivos:',
            error.status,
            error.error
        );

        return throwError(() => error);
    }
}