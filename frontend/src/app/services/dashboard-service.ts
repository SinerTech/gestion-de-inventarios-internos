import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class DashboardService {
    configuracionDashboard: any;

    obtenerConfiguracion(tipoDashboard: string) {
        if (tipoDashboard === 'supervisor') {
            this.configuracionDashboard = 
                {
                nombre: 'Nicolas',
                rol: 'Supervisor',
                descripcion: 'Gestioná y supervisá las operaciones de inventario de forma centralizada. ' +
                            'Desde este panel podrás supervisar ingresos de mercadería, movimientos de stock ' +
                            'y operaciones de control de forma centralizada.',
                accionesDisponibles: [
                    'Supervisar ingresos de mercadería.',
                    'Controlar movimientos de stock.',
                    'Consultar información del inventario.'
                ],
                informacionSistema: [
                    {
                    icono: 'bi-person-vcard-fill',
                    etiqueta: 'Rol actual',
                    valor: 'Supervisor'
                    },
                    {
                    icono: 'bi-box-seam-fill',
                    etiqueta: 'Módulo',
                    valor: 'Gestión de Inventarios'
                    },
                    {
                    icono: 'bi-binoculars-fill',
                    etiqueta: 'Acceso',
                    valor: 'Panel de Supervisión'
                    }
                ],
                accesosDirectos: [
                    {
                    icono: 'bi-box-seam-fill',
                    etiqueta: 'Ingreso de Stock',
                    descripcion: 'Registrar y consultar ingresos de mercadería en el inventario.',
                    link: '/sinertech/dashboard-supervisor/ingreso-stock'
                    },
                    {
                    icono: 'bi-arrow-left-right',
                    etiqueta: 'Movimientos',
                    descripcion: 'Supervisar los movimientos realizados sobre el stock.',
                    link: '/sinertech/dashboard-supervisor/ajuste-stock'
                    },
                    {
                    icono: 'bi-boxes',
                    etiqueta: 'Visualizar Stock',
                    descripcion: 'Buscar productos y consultar el estado actual del inventario.',
                    link: '/sinertech/dashboard-supervisor/control-stock'
                    }
                ]
            }
        } else if (tipoDashboard === 'administrador') {
            this.configuracionDashboard = 
                {
                nombre: 'Lucas',
                rol: 'Administrador',
                descripcion: 'Gestioná la información de los productos y consultá el estado del inventario de forma centralizada. ' +
                            'Desde este panel podrás registrar, modificar y administrar productos, ' +
                            'además de visualizar el stock disponible.',
                accionesDisponibles: [
                    'Gestionar usuarios.',
                    'Administrar productos.',
                    'Consultar información general del sistema.'
                ],
                informacionSistema: [
                    {
                    icono: 'bi-person-vcard-fill',
                    etiqueta: 'Rol actual',
                    valor: 'Administrador'
                    }
                ],
                accesosDirectos: [
                    // accesos del administrador
                ]
            }
        }
        return this.configuracionDashboard;
    }
};