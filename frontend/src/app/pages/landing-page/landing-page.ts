import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth-service';

@Component({
  imports: [RouterLink],
  selector: 'app-home',
  styleUrl: './landing-page.css',
  templateUrl: './landing-page.html',
})
export class LandingPage {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  titulo = 'Gestión Inteligente de Inventarios';
  descripcion =
    'Optimiza el control de stock de tu empresa mediante una plataforma moderna, segura y eficiente. Centraliza tu inventario en tiempo real, automatiza las alertas de reposición y toma decisiones estratégicas basadas en datos precisos. La solución definitiva para reducir costos operativos, evitar quiebres de stock y potenciar el crecimiento de tu negocio.';
  valores = [
    {
      icono: 'bi-hourglass-split',
      titulo: 'Control en tiempo real',
      descripcion: 'Consulta y administra el inventario desde cualquier lugar.'
    },
    {
      icono: 'bi-key',
      titulo: 'Mayor seguridad',
      descripcion: 'Acceso protegido mediante usuarios y roles.'
    },
    {
      icono: 'bi-lightbulb',
      titulo: 'Gestión eficiente',
      descripcion: 'Reduce errores y optimiza la toma de decisiones.'
    }
  ];

  comenzar(): void {
    const usuario = this.authService.obtenerUsuarioActual();

    if (!usuario) {
      this.router.navigate(['/login']);
      return;
    }

    switch (String(usuario.idRol)) {
      case '1':
        this.router.navigate(['/sinertech/dashboard-admin']);
        break;

      case '2':
        this.router.navigate(['/sinertech/dashboard-supervisor']);
        break;

      case '3':
        this.router.navigate(['/sinertech/dashboard-vendedor']);
        break;

      default:
        this.router.navigate(['/login']);
    }
  }
}