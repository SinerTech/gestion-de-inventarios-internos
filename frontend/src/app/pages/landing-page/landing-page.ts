import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth-service';
import { LandingPageService } from '../../services/landing-page/landing-page-service';

@Component({
  imports: [],
  selector: 'app-home',
  styleUrl: './landing-page.css',
  templateUrl: './landing-page.html',
})
export class LandingPage {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly landingPageService = inject(LandingPageService);
  private cdr = inject(ChangeDetectorRef)

  descripcion = '';
  valores: any[] = [];

  ngOnInit(): void {
    this.landingPageService.obtenerContenido().subscribe({
      next: (data) => {
        this.descripcion = data.descripcion;
        this.valores = data.valores;
      },
      error: (err) => {
        console.error('Error al obtener el contenido de la landing:', err);
      },
      complete: () => {
        console.info('complete');
        this.cdr.detectChanges();
      }
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