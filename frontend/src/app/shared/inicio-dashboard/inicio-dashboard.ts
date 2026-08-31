import { Component, inject } from '@angular/core';
import { DashboardService } from '../../services/dashboard-service';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-inicio-dashboard',
  styleUrl: './inicio-dashboard.css',
  templateUrl: './inicio-dashboard.html',
})
export class InicioDashboard {
  configuracionActual: any;
  private servicioDashboard = inject(DashboardService);
  private ruta = inject(ActivatedRoute);
  ngOnInit() {
      const tipoDashboard =
              this.ruta.snapshot.data['tipoDashboard'];
      this.configuracionActual =
          this.servicioDashboard.obtenerConfiguracion(
              tipoDashboard
          );
  }
}

