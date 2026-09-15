import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard/dashboard-service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ConfiguracionDashboard } from '../../models/dashboard.models';

@Component({
  imports: [RouterLink],
  selector: 'app-inicio-dashboard',
  styleUrl: './inicio-dashboard.css',
  templateUrl: './inicio-dashboard.html',
})
export class InicioDashboard implements OnInit {
  configuracionActual?: ConfiguracionDashboard;
  private servicioDashboard = inject(DashboardService);
  private ruta = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef)

  ngOnInit(): void {
      const tipoDashboard = this.ruta.snapshot.data['tipoDashboard'];
      this.servicioDashboard.obtenerConfiguracion().subscribe({
        next: (data) => {
          console.log(data);
          this.configuracionActual = data[tipoDashboard];
        },
        error: (e) =>
          console.error('Error al cargar la información del sistema', e),
        complete: () => {
          this.cdr.detectChanges();
          console.info('complete');
        }
      })
  }
}

