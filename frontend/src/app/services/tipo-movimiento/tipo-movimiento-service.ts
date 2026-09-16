import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TipoMovimiento } from '../../models/tipo-movimiento.models';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TipoMovimientoService {
    url = "http://localhost:3000/tipos-movimiento"
    private httpClient = inject(HttpClient)

    obtenerTiposMovimiento():Observable<TipoMovimiento[]> {
            return this.httpClient.get<TipoMovimiento[]>(this.url)
        }
}
