import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pedido } from '../../models/pedido.models';

@Injectable({
    providedIn: 'root'
})
export class PedidoService {
    private url = 'http://localhost:3000/pedidos';
    private httpClient = inject(HttpClient);

    registrarPedido(pedido: Omit<Pedido, 'id'>): Observable<Pedido> {
    return this.httpClient.post<Pedido>(this.url, pedido);
    }
}