export interface InformacionSistema {
    icono: string;
    etiqueta: string;
    valor: string;
}

export interface AccesosDirectos {
    icono: string;
    etiqueta: string;
    descripcion: string;
    link: string;
}

export interface AccionesTabla {
    icono: string;
}

export interface ConfiguracionDashboard {
    rol: string;
    descripcion: string;
    accionesDisponibles: string[];
    informacionSistema: InformacionSistema[];
    accesosDirectos: AccesosDirectos[];
    botonesFiltro: string[];
    encabezadosTabla: string[];
    accionesTabla: AccionesTabla[];
}

export interface Dashboards {
    administrador: ConfiguracionDashboard;
    supervisor: ConfiguracionDashboard;
    vendedor: ConfiguracionDashboard;
    [key: string]: ConfiguracionDashboard;
}
