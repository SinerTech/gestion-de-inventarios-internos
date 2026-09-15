import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard/dashboard-service';
import { ActivatedRoute } from '@angular/router';
import { Producto } from '../../models/producto.models';
import { ProductoService } from '../../services/producto/producto-service';
import { ConfiguracionDashboard } from '../../models/dashboard.models';

@Component({
  imports: [],
  selector: 'app-control-stock',
  styleUrl: './control-stock.css',
  templateUrl: './control-stock.html',
})
export class ControlStock implements OnInit {
  listaProductos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  terminoBusqueda = '';
  configuracionActual!: ConfiguracionDashboard;

  private servicioDashboard = inject(DashboardService);
  private ruta = inject(ActivatedRoute);
  private productService = inject(ProductoService);
  private cdr = inject(ChangeDetectorRef);

  readonly estadoClases: Record<string, string> = {
    Activo: 'bg-success',
    Inactivo: 'bg-danger',
    Suspendido: 'bg-warning',
    };

  ngOnInit(): void {
    const tipoDashboard = this.ruta.snapshot.data['tipoDashboard'];
    this.servicioDashboard.obtenerConfiguracion().subscribe({
      next: (data) => {
        console.log(data);
        this.configuracionActual = data[tipoDashboard];
      },
      error: (e) => 
        console.error('Error al cargar información de configuración del dashboard', e),
      complete: () =>{
          this.cdr.detectChanges();
          console.info('complete');
        }
      })

    this.productService.obtenerListaProductos().subscribe({
      next: (data) => {
        console.log(data);
        this.listaProductos = data;
        this.productosFiltrados = [...this.listaProductos];
      },
      error: (e) => 
        console.error('Error al cargar productos', e),
      complete: () =>{
          this.cdr.detectChanges();
          console.info('complete');
        }
      })
  }

  actualizarBusqueda(event: Event): void {
    const input = event.target as HTMLInputElement;

    this.terminoBusqueda =
      input.value.trim().toLowerCase();
  }

  buscarProducto(event: Event): void {
    event.preventDefault();

    if (!this.terminoBusqueda) {
      this.productosFiltrados = [
        ...this.listaProductos
      ];
      return;
    }

    this.productosFiltrados =
      this.listaProductos.filter(
        (producto) =>
          producto.nombreProducto
            .toLowerCase()
            .includes(this.terminoBusqueda) ||
          producto.sku
            .toLowerCase()
            .includes(this.terminoBusqueda)
      );
  }
}
