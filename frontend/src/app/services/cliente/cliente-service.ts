import {HttpClient } from '@angular/common/http';
import {inject, Injectable } from '@angular/core';
import {Observable } from 'rxjs';
import {Cliente } from '../../models/cliente.models';

@Injectable({
    providedIn: 'root'
})
export class ClienteService {
    private url = 'http://localhost:3000/clientes';
    private HttpClient = inject(HttpClient);

    obtenerClientes(): Observable<Cliente[]> {
        return this.HttpClient.get<Cliente[]>(this.url);
    }
}