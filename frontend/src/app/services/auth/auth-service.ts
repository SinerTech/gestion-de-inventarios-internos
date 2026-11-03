import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, tap, throwError } from 'rxjs';
import { NuevoUsuario, Usuario } from '../../models/usuario.models';
import { Rol } from '../../models/rol.models';

interface RolApi {
  id_rol: number;
  nombre_rol: string;
}

interface UsuarioApi {
  id_usuario: number;
  nombre_usuario: string;
  apellido_usuario: string;
  email_usuario: string;
  id_rol: number;
  rol: RolApi;
  activo: boolean;
}

interface RespuestaLogin {
  usuario: UsuarioApi;
}

const CLAVE_USUARIO = 'usuario_actual';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = 'http://localhost:8000/api/v1';

    login(email: string, password: string): Observable<Usuario> {
        return this.http.post<RespuestaLogin>(`${this.apiUrl}/login/`, {email, password,}).pipe(
            map(({ usuario }) => this.aUsuario(usuario)),
            tap((usuario) => localStorage.setItem(CLAVE_USUARIO, JSON.stringify(usuario))),
            catchError(this.handleError),
        );
    }
    
    registro(nuevo: NuevoUsuario): Observable<unknown> {
        return this.http
        .post(`${this.apiUrl}/usuarios/`, {
            nombre_usuario: nuevo.nombreUsuario,
            apellido_usuario: nuevo.apellidoUsuario,
            email_usuario: nuevo.emailUsuario,
            password: nuevo.password,
        })
        .pipe(catchError(this.handleError));
    }

    obtenerRoles(): Observable<Rol[]> {
        return this.http.get<RolApi[]>(`${this.apiUrl}/roles/`).pipe(
        map((roles) => roles.map((r) => this.aRol(r))),
        catchError(this.handleError),
        );
    }

    logout(): void {
        localStorage.removeItem(CLAVE_USUARIO);
    }

    obtenerUsuarioActual(): Usuario | null {
        const usuario = localStorage.getItem(CLAVE_USUARIO);
        return usuario ? (JSON.parse(usuario) as Usuario) : null;
    }

    estaLogueado(): boolean {
        return this.obtenerUsuarioActual() !== null;
    }

    obtenerRutaDashboard(usuario: Usuario): string{
        switch (usuario.idRol) {
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

    private aRol(r: RolApi): Rol {
        return { idRol: r.id_rol, nombreRol: r.nombre_rol };
    }

    private aUsuario(u: UsuarioApi): Usuario {
        return {
        idUsuario: u.id_usuario,
        nombreUsuario: u.nombre_usuario,
        apellidoUsuario: u.apellido_usuario,
        emailUsuario: u.email_usuario,
        idRol: u.id_rol,
        rol: this.aRol(u.rol),
        activo: u.activo,
        };
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

