import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Categoria } from '../../models/categoria.models';

@Injectable({
    providedIn: 'root'
})
export class CategoriaService {
    url = "http://localhost:3000/categorias"
    private httpClient = inject(HttpClient)

    obtenerCategorias():Observable<Categoria[]> {
        return this.httpClient.get<Categoria[]>(this.url).pipe(
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
