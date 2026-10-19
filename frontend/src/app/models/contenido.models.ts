
import { ConfiguracionDashboard } from './dashboard.models';

export interface IntegranteEquipo {
  id: string;
  nombre: string;
  rol: string;
  imagen: string;
  alt: string;
  bio: string;
}

export interface ValorLanding {
  icono: string;
  titulo: string;
  descripcion: string;
}

export interface ContenidoLanding {
  descripcion: string;
  valores: ValorLanding[];
}

export interface Contenido {
  dashboards: Record<string, ConfiguracionDashboard>;
  landing: ContenidoLanding;
  'quienes-somos': IntegranteEquipo[];
}
