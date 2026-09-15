import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Dashboards } from '../../models/dashboard.models';

@Injectable({
    providedIn: 'root'
})
export class DashboardService {
    url = "http://localhost:3000/dashboards"
    configuracionDashboard!: Dashboards;
    private httpClient = inject(HttpClient)
    
    obtenerConfiguracion():Observable<Dashboards> {
        return this.httpClient.get<Dashboards>(this.url)
    }
};
