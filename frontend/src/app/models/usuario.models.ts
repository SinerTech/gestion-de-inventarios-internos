export interface Usuario {
    idUsuario: number;
    nombreUsuario: string;
    idRol: number;
    emailUsuario: string;
    password: string;
}

export interface UsuarioLogueado {
    nombreUsuario: string;
    idRol: number;
}
