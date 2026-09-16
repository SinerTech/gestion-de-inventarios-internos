import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MovimientoInventario } from '../../models/movimiento-inventario.models';

@Injectable({
    providedIn: 'root'
})
export class MovimientoInventarioService {
    url = "http://localhost:3000/movimientos-inventario"
    private httpClient = inject(HttpClient)

    obtenerMovimientosInventario():Observable<MovimientoInventario[]> {
        return this.httpClient.get<MovimientoInventario[]>(this.url)
    }

    registrarMovimiento(movimiento: MovimientoInventario):Observable<MovimientoInventario> {
        return this.httpClient.post<MovimientoInventario>(this.url, movimiento)
    }
}