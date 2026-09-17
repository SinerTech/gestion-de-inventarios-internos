import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard/dashboard-service';
import { ActivatedRoute } from '@angular/router';
import { Producto } from '../../models/producto.models';
import { ProductoService } from '../../services/producto/producto-service';
import { ConfiguracionDashboard } from '../../models/dashboard.models';
import { Categoria } from '../../models/categoria.models';
import { Proveedor } from '../../models/proveedor.models';
import { CategoriaService } from '../../services/categoria/categoria-service';
import { ProveedorService } from '../../services/proveedor/proveedor-service';
import { CurrencyPipe } from '@angular/common';
import { ProductoProveedor } from '../../models/producto-proveedor';
import { ProductoProveedorService } from '../../services/producto-proveedor/producto-proveedor-service';

@Component({
  imports: [CurrencyPipe],
  selector: 'app-control-stock',
  styleUrl: './control-stock.css',
  templateUrl: './control-stock.html',
})
export class ControlStock implements OnInit {
  listaProductos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  listaCategorias: Categoria[] = [];
  listaProveedores: Proveedor[] = [];
  listaProductosProveedores: ProductoProveedor[] = []
  terminoBusqueda = '';
  configuracionActual!: ConfiguracionDashboard;

  private servicioDashboard = inject(DashboardService);
  private ruta = inject(ActivatedRoute);
  private productService = inject(ProductoService);
  private categoriaService = inject(CategoriaService);
  private proveedorService = inject(ProveedorService);
  private productoProveedorService = inject(ProductoProveedorService);
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
      });
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
      });
    this.categoriaService.obtenerCategorias().subscribe({
      next: (data) => {
        console.log(data);
        this.listaCategorias = data;
      },
      error: (e) => 
        console.error('Error al cargar categorias', e),
      complete: () =>{
          this.cdr.detectChanges();
          console.info('complete');
        }
    });
    this.proveedorService.obtenerProveedores().subscribe({
      next: (data) => {
        console.log(data);
        this.listaProveedores = data;
      },
      error: (e) => 
        console.error('Error al cargar proveedores', e),
      complete: () =>{
          this.cdr.detectChanges();
          console.info('complete');
        }
    });
    this.productoProveedorService.obtenerProductosProveedores().subscribe({
      next: (data) => {
        console.log(data);
        this.listaProductosProveedores = data;
      },
      error: (e) => 
        console.error('Error al cargar relaciones productos-proveedores', e),
      complete: () =>{
          this.cdr.detectChanges();
          console.info('complete');
        }
    });
  }

  obtenerNombreCategoria(idCategoria: string): string {
    const categoria = this.listaCategorias.find(
        categoria => categoria.id === idCategoria
    );
    return categoria?.nombreCategoria ?? 'Sin categoría';
  }

  obtenerRazonSocialProveedor(idProveedor: string): string {
      const proveedor = this.listaProveedores.find(
          proveedor => proveedor.id === idProveedor
      );
      return proveedor?.razonSocial ?? 'Sin proveedor';
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

  filtrarPorEstado(estado: string): void {
    if (estado === 'todos') {
      this.productosFiltrados = [...this.listaProductos];
      return;
    }

    this.productosFiltrados = this.listaProductos.filter(
      producto => producto.estado.toLowerCase() === estado.toLowerCase()
    );
  }

  obtenerProveedoresProducto(idProducto: string): Proveedor[] {
  const relaciones = this.listaProductosProveedores.filter(
    relacion => relacion.idProducto === idProducto
  );
  return relaciones
    .map(relacion =>
      this.listaProveedores.find(
        proveedor => proveedor.id === relacion.idProveedor
      )
    )
    .filter((proveedor): proveedor is Proveedor => proveedor !== undefined);
  }
}
