import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth-service';
import { ContenidoService } from '../../services/contenido/contenido-service';
import { ValorLanding } from '../../models/contenido.models';

@Component({
  imports: [],
  selector: 'app-home',
  styleUrl: './landing-page.css',
  templateUrl: './landing-page.html',
})
export class LandingPage {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly contenidoService = inject(ContenidoService);

  descripcion = '';
  valores: any[] = [];

  ngOnInit(): void {
    this.contenidoService.obtenerLanding().subscribe({
      next: (data) => {
        this.descripcion = data.descripcion;
        this.valores = data.valores;
      },
      error: (err) => {
        console.error('Error al obtener el contenido de la landing:', err);
      },
    });
  }

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