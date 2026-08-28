import { Routes } from '@angular/router';
import { DashboardSupervisor } from './pages/dashboard/dashboard-supervisor/dashboard-supervisor';
import { MainLayout } from './layouts/main-layout/main-layout';
import { IngresoStock } from './pages/dashboard/dashboard-supervisor/ingreso-stock/ingreso-stock';
import { AjusteStock } from './pages/dashboard/dashboard-supervisor/ajuste-stock/ajuste-stock';
import { ControlStock } from './pages/dashboard/dashboard-supervisor/control-stock/control-stock';
import { InicioDashboard } from './shared/inicio-dashboard/inicio-dashboard';


export const routes: Routes = [
    {path: "", redirectTo: "sinertech/landing-page", pathMatch: 'full'},
    {path: "sinertech", component: MainLayout,
        children: [
        {path: "dashboard-supervisor", component: DashboardSupervisor,
            children: [
                { path: '', redirectTo: 'inicio-dashboard-supervisor', pathMatch: 'full' },
                {path: 'inicio-dashboard', component: InicioDashboard},
                {path: 'ingreso-stock', component: IngresoStock},
                {path: 'ajuste-stock', component: AjusteStock},
                {path: 'control-stock', component: ControlStock}
                ]
            }
        ]
        }
    ]
