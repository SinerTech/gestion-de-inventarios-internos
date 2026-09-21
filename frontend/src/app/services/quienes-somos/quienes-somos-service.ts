import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Service,inject } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Service()
export class QuienesSomosService {
  url = 'http://localhost:3000/quienes-somos';
  private httpClient = inject(HttpClient)
  

  obtenerMiembrosEquipo(): Observable<any> 
  {
    return this.httpClient.get(this.url).pipe(
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
