import { Component, Input } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from "@angular/router";

@Component({
  imports: [RouterLink, RouterLinkActive],
  selector: 'app-header',
  styleUrl: './header.css',
  templateUrl: './header.html',
})
export class Header {
  logoSinertech: string = "logo/logo_icon.png";
  // Estas funciones se reemplazaran a futuro, actualmente ofrecen solo simulación
  // Simulación dinamica del componente
  // Cambiar a true para observar el boton Cerrar Sesión en dashboards y probarlo dinamicamente
  estaAutenticado: boolean = false;
  cerrarSesion(): void {
    this.estaAutenticado=!this.estaAutenticado
    alert("Cerrando Sesión")
  };
  constructor(private router: Router) {}
  get esDashboard(): boolean {
      return this.router.url.includes('dashboard');
  }
}
