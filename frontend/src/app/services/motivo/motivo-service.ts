import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Motivo } from '../../models/motivo.models';

@Injectable({
    providedIn: 'root'
})
export class MotivoService {
    url = "http://localhost:3000/motivos"
    private httpClient = inject(HttpClient)

    obtenerMotivos():Observable<Motivo[]> {
        return this.httpClient.get<Motivo[]>(this.url)
    }
}
