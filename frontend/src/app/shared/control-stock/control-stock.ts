import { Component, inject } from '@angular/core';
import { DashboardService } from '../../services/dashboard-service';
import { ActivatedRoute } from '@angular/router';

@Component({
  imports: [],
  selector: 'app-control-stock',
  styleUrl: './control-stock.css',
  templateUrl: './control-stock.html',
})
export class ControlStock {
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
