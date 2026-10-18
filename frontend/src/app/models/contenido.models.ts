
import { ConfiguracionDashboard } from './dashboard.models';

export interface IntegranteEquipo {
  id: string;
  nombre: string;
  rol: string;
  imagen: string;
  alt: string;
  bio: string;
}

export interface Contenido {
  dashboards: Record<string, ConfiguracionDashboard>;
  'quienes-somos': IntegranteEquipo[];
}
