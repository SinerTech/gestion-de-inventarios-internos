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
                ],
                botonesFiltro: [
                    'todos',
                    'activo',
                    'inactivo',
                    'suspendido'
                ],
                encabezadosTabla: [
                    'ID',
                    'SKU',
                    'Producto',
                    'Categoría',
                    'Proveedor',
                    'Precio Unitario',
                    'Stock',
                    'Estado',
                    'Último Ingreso'
                ],
                productos: [
                    {
                        id: '001',
                        sku: 'PROD-001',
                        nombre: 'Producto 1',
                        categoria: 'Categoría 1',
                        proveedor: 'Proveedor 1',
                        precioUnitario: '$1500',
                        stock: 50,
                        estado: 'Activo',
                        claseEstado: 'bg-success',
                        ultimoIngreso: '05/04/2026'
                    },
                    {
                        id: '002',
                        sku: 'PROD-002',
                        nombre: 'Producto 2',
                        categoria: 'Categoría 1',
                        proveedor: 'Proveedor 1',
                        precioUnitario: '$1750',
                        stock: 33,
                        estado: 'Activo',
                        claseEstado: 'bg-success',
                        ultimoIngreso: '05/04/2026'
                    },
                    {
                        id: '003',
                        sku: 'PROD-003',
                        nombre: 'Producto 3',
                        categoria: 'Categoría 2',
                        proveedor: 'Proveedor 5',
                        precioUnitario: '$5500',
                        stock: 0,
                        estado: 'Inactivo',
                        claseEstado: 'bg-danger',
                        ultimoIngreso: '22/12/2025'
                    },
                    {
                        id: '004',
                        sku: 'PROD-004',
                        nombre: 'Producto 4',
                        categoria: 'Categoría 3',
                        proveedor: 'Proveedor 3',
                        precioUnitario: '$2050',
                        stock: 64,
                        estado: 'Suspendido',
                        claseEstado: 'bg-warning',
                        ultimoIngreso: '09/05/2026'
                    }
                ],
                accionesTabla: []
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
                    'Administrar el inventario.',
                    'Dar de alta o baja a productos.',
                    'Consultar información del inventario.'
                ],
                informacionSistema: [
                    {
                    icono: 'bi-person-vcard-fill',
                    etiqueta: 'Rol actual',
                    valor: 'Administrador'
                    },
                    {
                    icono: 'bi-box-seam-fill',
                    etiqueta: 'Módulo',
                    valor: 'Administración del Inventario'
                    },
                    {
                    icono: 'bi-binoculars-fill',
                    etiqueta: 'Acceso',
                    valor: 'Panel de Administración'
                    }
                ],
                accesosDirectos: [
                    {
                        icono: 'bi-box-seam-fill',
                        etiqueta: 'Gestionar Productos',
                        descripcion: 'Crear, consultar, modificar y eliminar productos del inventario.',
                        link: '/sinertech/dashboard-admin/registro-producto'
                    },
                    {
                        icono: 'bi-boxes',
                        etiqueta: 'Visualizar Stock',
                        descripcion: 'Consultar los productos disponibles y el estado actual del inventario.',
                        link: '/sinertech/dashboard-admin/control-stock'
                    }
                ],
                botonesFiltro: [
                    'todos',
                    'activo',
                    'inactivo',
                    'suspendido'
                ],
                encabezadosTabla: [
                    'ID',
                    'SKU',
                    'Producto',
                    'Categoría',
                    'Proveedor',
                    'Precio Unitario',
                    'Stock',
                    'Estado',
                    'Último Ingreso'
                ],
                productos: [
                    {
                        id: '001',
                        sku: 'PROD-001',
                        nombre: 'Producto 1',
                        categoria: 'Categoría 1',
                        proveedor: 'Proveedor 1',
                        precioUnitario: '$1500',
                        stock: 50,
                        estado: 'Activo',
                        claseEstado: 'bg-success',
                        ultimoIngreso: '05/04/2026'
                    },
                    {
                        id: '002',
                        sku: 'PROD-002',
                        nombre: 'Producto 2',
                        categoria: 'Categoría 1',
                        proveedor: 'Proveedor 1',
                        precioUnitario: '$1750',
                        stock: 33,
                        estado: 'Activo',
                        claseEstado: 'bg-success',
                        ultimoIngreso: '05/04/2026'
                    },
                    {
                        id: '003',
                        sku: 'PROD-003',
                        nombre: 'Producto 3',
                        categoria: 'Categoría 2',
                        proveedor: 'Proveedor 5',
                        precioUnitario: '$5500',
                        stock: 0,
                        estado: 'Inactivo',
                        claseEstado: 'bg-danger',
                        ultimoIngreso: '22/12/2025'
                    },
                    {
                        id: '004',
                        sku: 'PROD-004',
                        nombre: 'Producto 4',
                        categoria: 'Categoría 3',
                        proveedor: 'Proveedor 3',
                        precioUnitario: '$2050',
                        stock: 64,
                        estado: 'Suspendido',
                        claseEstado: 'bg-warning',
                        ultimoIngreso: '09/05/2026'
                    }
                ],
                accionesTabla: [
                    {
                        icono: 'bi bi-pencil-fill',
                    },
                    {
                        icono: 'bi bi-trash-fill',
                    }
                ]
            }
        }
        return this.configuracionDashboard;
    }
};