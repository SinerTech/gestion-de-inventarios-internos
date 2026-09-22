import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Dashboards } from '../../models/dashboard.models';

@Injectable({
    providedIn: 'root'
})
export class DashboardService {
    url = "http://localhost:3000/dashboards"
    configuracionDashboard!: Dashboards;
    private httpClient = inject(HttpClient)
    
    obtenerConfiguracion():Observable<Dashboards> {
        return this.httpClient.get<Dashboards>(this.url).pipe(
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
};
