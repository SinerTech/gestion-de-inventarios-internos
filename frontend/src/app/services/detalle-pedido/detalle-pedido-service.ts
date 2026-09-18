import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DetallePedido } from '../../models/detalle-pedido.models';

@Injectable({
    providedIn: 'root'
})
export class DetallePedidoService {
    private url = 'http://localhost:3000/detalles-pedido';
    private httpClient = inject(HttpClient);

    registrarDetalle(
    detalle: Omit<DetallePedido, 'id'>
    ): Observable<DetallePedido> {
    return this.httpClient.post<DetallePedido>(this.url, detalle);
    }
}