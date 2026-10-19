import { Rol } from './rol.models';

export interface Usuario {
  idUsuario: number;
  nombreUsuario: string;
  apellidoUsuario: string;
  emailUsuario: string;
  idRol: number;
  rol: Rol;
  activo: boolean;
}

export interface NuevoUsuario {
  nombreUsuario: string;
  apellidoUsuario: string;
  emailUsuario: string;
  idRol: number;
  password: string;
}