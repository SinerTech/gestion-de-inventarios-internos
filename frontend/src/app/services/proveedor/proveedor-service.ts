import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Proveedor } from '../../models/proveedor.models';

@Injectable({
    providedIn: 'root'
})
export class ProveedorService {
    url = "http://localhost:3000/proveedores"
    private httpClient = inject(HttpClient)

    obtenerProveedores():Observable<Proveedor[]> {
        return this.httpClient.get<Proveedor[]>(this.url)
    }
}
