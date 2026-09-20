import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Usuario } from '../../models/usuario.models';
import { Rol } from '../../models/rol.models';

@Service()
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000';

  /**
   * Obtiene la lista de roles desde db.json
   */
  obtenerRoles(): Observable<Rol[]> {
    return this.http.get<Rol[]>(`${this.apiUrl}/roles`);
  }

  /**
   * Valida las credenciales contra db.json consultando por query params
   */
  login(email: string, pass: string, idRol: string): Observable<Usuario | null> {
  return this.http.get<Usuario[]>(`${this.apiUrl}/usuarios`).pipe(
    map((usuarios) => {
      const usuarioEncontrado = usuarios.find(
        (u) =>
          u.emailUsuario.trim().toLowerCase() === email.trim().toLowerCase() &&
          String(u.password) === String(pass) &&
          String(u.idRol) === String(idRol)
      );

      return usuarioEncontrado ?? null;
    })
  );
}

  /**
   * Registra un nuevo usuario en la colección de usuarios
   */
  registro(nuevoUsuario: Omit<Usuario, 'id'>): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/usuarios`, nuevoUsuario);
  }
}