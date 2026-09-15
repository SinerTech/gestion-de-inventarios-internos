import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class DashboardService {
    configuracionDashboard: any;
    // Implementar la obtención de la configuración del dashboard con HTTPClient desde JSON server.
    // obtenerConfiguracion()
    // El nombre del usuario mostrado en la vista debe provenir del usuario logueado,
    // no de la configuración del dashboard.
};