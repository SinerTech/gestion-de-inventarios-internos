import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cliente } from '../../models/cliente.models';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private url = 'http://localhost:8000/api/v1/clientes/';
  private httpClient = inject(HttpClient);

  obtenerClientes(): Observable<Cliente[]> {
    return this.httpClient.get<Cliente[]>(this.url);
  }
}