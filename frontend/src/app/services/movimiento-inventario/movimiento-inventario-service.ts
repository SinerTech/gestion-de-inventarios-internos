import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { MovimientoInventario } from '../../models/movimiento-inventario.models';

export interface MovimientoStockRequest {
    id_producto: number;
    cantidad_movimiento: number;
    id_motivo: number;
    id_usuario: number;
    observaciones?: string;
}

export interface IngresoRequest extends MovimientoStockRequest {
    id_proveedor?: number | null;
    numero_lote_factura?: string | null;
}

export interface RespuestaMovimiento {
    mensaje: string;
}

@Injectable({
    providedIn: 'root'
})
export class MovimientoInventarioService {
    private readonly baseUrl = 'http://localhost:8000/api/v1/';

    private readonly urlIngresos = `${this.baseUrl}ingresos/`;
    private readonly urlAjustes = `${this.baseUrl}ajustes/`;

    private httpClient = inject(HttpClient);

    registrarIngreso(datos: IngresoRequest): Observable<RespuestaMovimiento> {
        return this.httpClient.post<RespuestaMovimiento>(this.urlIngresos, datos).pipe(
            catchError(this.handleError)
        );
    }

    registrarAjuste(datos: MovimientoStockRequest): Observable<RespuestaMovimiento> {
        return this.httpClient.post<RespuestaMovimiento>(this.urlAjustes, datos).pipe(
            catchError(this.handleError)
        );
    }

    registrarMovimiento(
    movimiento: MovimientoInventario
    ): Observable<MovimientoInventario> {
    return this.httpClient
        .post<MovimientoInventario>(
        'http://localhost:3000/movimientos-inventario',
        movimiento
        )
        .pipe(catchError(this.handleError));
    }

    private handleError(error: HttpErrorResponse) {
        console.error('Error en la API de movimientos:', error.status, error.error);
        return throwError(() => error);
    }
}
