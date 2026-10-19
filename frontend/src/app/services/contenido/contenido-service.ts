
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import contenidoJson from '../../data/contenido.json';
import {
  Contenido,
  ContenidoLanding,
  IntegranteEquipo,
} from '../../models/contenido.models';
import { ConfiguracionDashboard } from '../../models/dashboard.models';

@Injectable({
  providedIn: 'root',
})
export class ContenidoService {
  private readonly contenido = contenidoJson as Contenido;

  obtenerDashboard(
    clave: string,
  ): Observable<ConfiguracionDashboard> {
    const dashboard = this.contenido.dashboards[clave];

    return dashboard
      ? of(dashboard)
      : throwError(
          () => new Error(`No existe el dashboard "${clave}"`),
        );
  }

  obtenerQuienesSomos(): Observable<IntegranteEquipo[]> {
    return of(this.contenido['quienes-somos']);
  }

  obtenerLanding(): Observable<ContenidoLanding> {
    return of(this.contenido.landing);
  }
}
