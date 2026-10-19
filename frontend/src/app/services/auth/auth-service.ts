import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Usuario } from '../../models/usuario.models';

interface RespuestaLogin {
    usuario: {
        id_usuario: number;
        nombre_usuario: string;
        apellido_usuario: string;
        email_usuario: string;
        id_rol: number;
        rol: {
        id_rol: number;
        nombre_rol: string;
        };
        activo: boolean;
    };
}

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = 'http://localhost:8000/api';

    login(email: string, password: string): Observable<Usuario> {
        return this.http.post<RespuestaLogin>(`${this.apiUrl}/login/`, {email, password,}).pipe(
            map(({ usuario }) => ({
                idUsuario: usuario.id_usuario,
                nombreUsuario: usuario.nombre_usuario,
                apeliidoUsuario: usuario.apellido_usuario,
                emailUsuario: usuario.email_usuario,
                idRol: usuario.id_rol,
                activo: usuario.activo,
                rol: usuario.rol,
            })),
            catchError(this.handleError)
        );
    }

    obtenerUsuarioActual(): Usuario | null {
        const usuario = localStorage.getItem('usuario_actual');
        if (!usuario) {
            return null;
        }
            return JSON.parse(usuario) as Usuario;
        }

    estaLogueado(): boolean {
        return this.obtenerUsuarioActual() !== null;
    }

    obtenerRutaDashboard(usuario: Usuario): string{
        switch (number(usuario.idRol)) {
        case 1:
            return '/sinertech/dashboard-admin';
        case 2:
            return '/sinertech/dashboard-supervisor';
        case 3:
            return '/sinertech/dashboard-vendedor';
        default:
            return '/';
        }
    }

    private handleError(error: HttpErrorResponse) {
        if (error.status === 0) {
            console.error('Error de conexión con el servidor:', error.message);
        } else {
            console.error(
                `Error HTTP ${error.status}:`,
                error.error
            );
        }
        return throwError(() => error);
    }
}

