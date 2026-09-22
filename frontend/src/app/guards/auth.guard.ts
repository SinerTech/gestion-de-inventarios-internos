import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth-service';

export const authGuard: CanActivateFn = (route) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const usuario = authService.obtenerUsuarioActual();

    if (!usuario) {
        return router.createUrlTree(['/login']);
    }

    const rolesPermitidos = route.data['rolesPermitidos'] as string[];

    if (rolesPermitidos.includes(String(usuario.idRol))) {
        return true;
    }

    return router.createUrlTree([
        authService.obtenerRutaDashboard(usuario)
    ]);
};