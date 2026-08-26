import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";

@Component({
  imports: [RouterLink, RouterLinkActive],
  selector: 'app-header',
  styleUrl: './header.css',
  templateUrl: './header.html',
})
export class Header {
  logoSinertech: string = "logo/logo_icon.png";
  // Simulación dinamica del componente
  estaAutenticado: boolean = true;
  cerrarSesion(): void {
    this.estaAutenticado=!this.estaAutenticado
    alert("Cerrando Sesión")
  };
}
