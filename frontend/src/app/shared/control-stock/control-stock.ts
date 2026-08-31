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
  productosFiltrados: any[] = [];
  terminoBusqueda = '';

  private servicioDashboard = inject(DashboardService);
  private ruta = inject(ActivatedRoute);

  ngOnInit() {
    const tipoDashboard =
      this.ruta.snapshot.data['tipoDashboard'];

    this.configuracionActual =
      this.servicioDashboard.obtenerConfiguracion(
        tipoDashboard
      );

    this.productosFiltrados = [
      ...this.configuracionActual.productos
    ];
  }

  actualizarBusqueda(event: Event) {
    const input = event.target as HTMLInputElement;

    this.terminoBusqueda =
      input.value.trim().toLowerCase();
  }

  buscarProducto(event: Event) {
    event.preventDefault();

    if (!this.terminoBusqueda) {
      this.productosFiltrados = [
        ...this.configuracionActual.productos
      ];
      return;
    }

    this.productosFiltrados =
      this.configuracionActual.productos.filter(
        (producto: any) =>
          producto.nombre
            .toLowerCase()
            .includes(this.terminoBusqueda) ||
          producto.sku
            .toLowerCase()
            .includes(this.terminoBusqueda)
      );
  }
}
