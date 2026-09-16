import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Producto } from '../../models/producto.models';

@Injectable({
    providedIn: 'root'
})
export class ProductoService {
    url = "http://localhost:3000/productos"
    private httpClient = inject(HttpClient)
    
    obtenerListaProductos():Observable<Producto[]> {
        return this.httpClient.get<Producto[]>(this.url)
    }

    actualizarCantidadExistente(id: string, producto: Producto): Observable<Producto> {
        return this.httpClient.put<Producto>(`${this.url}/${id}`, producto)
    }
}
