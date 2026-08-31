import { Routes } from '@angular/router';
import { DashboardSupervisor } from './pages/dashboard/dashboard-supervisor/dashboard-supervisor';
import { MainLayout } from './layouts/main-layout/main-layout';
import { IngresoStock } from './pages/dashboard/dashboard-supervisor/ingreso-stock/ingreso-stock';
import { AjusteStock } from './pages/dashboard/dashboard-supervisor/ajuste-stock/ajuste-stock';
import { ControlStock } from './shared/control-stock/control-stock';
import { InicioDashboard } from './shared/inicio-dashboard/inicio-dashboard';
import { Pagina404 } from './pages/pagina-404/pagina-404';
import { Home } from './pages/home/home';
import { Login } from './auth/login/login';
import { Registro } from './auth/registro/registro';
import { DashboardAdmin } from './pages/dashboard/dashboard-admin/dashboard-admin';
import { RegistroProducto } from './pages/dashboard/dashboard-admin/registro-producto/registro-producto';
import { DashboardVendedor } from './pages/dashboard/dashboard-vendedor/dashboard-vendedor';
import { ResumenVenta } from './pages/dashboard/dashboard-vendedor/resumen-venta/resumen-venta';
import { QuienesSomos } from './pages/quienes-somos/quienes-somos';


export const routes: Routes = [
    {path: "", redirectTo: "sinertech/landing-page", pathMatch: 'full'},
    {path: "login", component: Login},
    {path: "registro", component: Registro},
    {path: "sinertech", component: MainLayout,
        children: [
<<<<<<< HEAD
=======
            {path: "quienes-somos" , component: QuienesSomos},
>>>>>>> develop
            {path: "landing-page", component: Home},
            {path: "dashboard-supervisor", component: DashboardSupervisor,
                children: [
                    { path: '', redirectTo: 'inicio-dashboard', pathMatch: 'full'},
                    {path: 'inicio-dashboard', component: InicioDashboard, data: {tipoDashboard: 'supervisor'}},
                    {path: 'ingreso-stock', component: IngresoStock},
                    {path: 'ajuste-stock', component: AjusteStock},
                    {path: 'control-stock', component: ControlStock, data: {tipoDashboard: 'supervisor'}}
                    ]
                },
            {path: "dashboard-admin", component: DashboardAdmin,
                children: [
                    { path: '', redirectTo: 'inicio-dashboard', pathMatch: 'full'},
                    {path: 'inicio-dashboard', component: InicioDashboard, data: {tipoDashboard: 'administrador'}},
                    {path: 'registro-producto', component: RegistroProducto},
                    {path: 'control-stock', component: ControlStock, data: {tipoDashboard: 'administrador'}}
                    ]
                },
            {path: "dashboard-vendedor", component: DashboardVendedor,
                children: [
                    { path: '', redirectTo: 'inicio-dashboard', pathMatch: 'full'},
                    {path: 'inicio-dashboard', component: InicioDashboard, data: {tipoDashboard: 'vendedor'}},
                    {path: 'control-stock', component: ControlStock, data: {tipoDashboard: 'vendedor'}},
                    {path: 'resumen-venta', component: ResumenVenta}
                ]
            }
        ]
    },
    {path: "**", component: Pagina404}
    ]
