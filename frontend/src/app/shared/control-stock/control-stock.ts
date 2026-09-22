import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard/dashboard-service';
import { ActivatedRoute, Router } from '@angular/router';
import { Producto } from '../../models/producto.models';
import { ProductoService } from '../../services/producto/producto-service';
import { ConfiguracionDashboard } from '../../models/dashboard.models';
import { Categoria } from '../../models/categoria.models';
import { Proveedor } from '../../models/proveedor.models';
import { CategoriaService } from '../../services/categoria/categoria-service';
import { ProveedorService } from '../../services/proveedor/proveedor-service';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ProductoProveedor } from '../../models/producto-proveedor';
import { ProductoProveedorService } from '../../services/producto-proveedor/producto-proveedor-service';

@Component({
  imports: [CurrencyPipe, DatePipe],
  selector: 'app-control-stock',
  styleUrl: './control-stock.css',
  templateUrl: './control-stock.html',
})
export class ControlStock implements OnInit {
  listaProductos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  listaCategorias: Categoria[] = [];
  listaProveedores: Proveedor[] = [];
  listaProductosProveedores: ProductoProveedor[] = [];

  terminoBusqueda = '';

  configuracionActual!: ConfiguracionDashboard;

  private servicioDashboard = inject(DashboardService);
  private ruta = inject(ActivatedRoute);
  private router = inject(Router);

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

    // ==========================================
    // CONFIGURACIÓN DEL DASHBOARD
    // ==========================================

    this.servicioDashboard.obtenerConfiguracion().subscribe({
      next: (data) => {
        console.log(data);

        this.configuracionActual = data[tipoDashboard];
      },

      error: (e) => console.error('Error al cargar información de configuración del dashboard', e),

      complete: () => {
        this.cdr.detectChanges();

        console.info('complete');
      },
    });

    // ==========================================
    // PRODUCTOS
    // ==========================================

    this.cargarProductos();

    // ==========================================
    // CATEGORÍAS
    // ==========================================

    this.categoriaService.obtenerCategorias().subscribe({
      next: (data) => {
        console.log(data);

        this.listaCategorias = data;
      },

      error: (e) => console.error('Error al cargar categorias', e),

      complete: () => {
        this.cdr.detectChanges();

        console.info('complete');
      },
    });

    // ==========================================
    // PROVEEDORES
    // ==========================================

    this.proveedorService.obtenerProveedores().subscribe({
      next: (data) => {
        console.log(data);

        this.listaProveedores = data;
      },

      error: (e) => console.error('Error al cargar proveedores', e),

      complete: () => {
        this.cdr.detectChanges();

        console.info('complete');
      },
    });

    // ==========================================
    // RELACIONES PRODUCTO - PROVEEDOR
    // ==========================================

    this.productoProveedorService.obtenerProductosProveedores().subscribe({
      next: (data) => {
        console.log(data);

        this.listaProductosProveedores = data;
      },

      error: (e) => console.error('Error al cargar relaciones productos-proveedores', e),

      complete: () => {
        this.cdr.detectChanges();

        console.info('complete');
      },
    });
  }

  // ==========================================
  // CARGAR PRODUCTOS
  // ==========================================

  cargarProductos(): void {
    this.productService.obtenerListaProductos().subscribe({
      next: (data) => {
        console.log(data);

        this.listaProductos = data;

        this.productosFiltrados = [...this.listaProductos];

        this.cdr.detectChanges();
      },

      error: (e) => {
        console.error('Error al cargar productos', e);
      },
    });
  }

  // ==========================================
  // OBTENER CATEGORÍA
  // ==========================================

  obtenerNombreCategoria(idCategoria: string): string {
    const categoria = this.listaCategorias.find((categoria) => categoria.id === idCategoria);

    return categoria?.nombreCategoria ?? 'Sin categoría';
  }

  // ==========================================
  // OBTENER PROVEEDOR
  // ==========================================

  obtenerRazonSocialProveedor(idProveedor: string): string {
    const proveedor = this.listaProveedores.find((proveedor) => proveedor.id === idProveedor);

    return proveedor?.razonSocial ?? 'Sin proveedor';
  }

  // ==========================================
  // ACTUALIZAR BÚSQUEDA
  // ==========================================

  actualizarBusqueda(event: Event): void {
    const input = event.target as HTMLInputElement;

    this.terminoBusqueda = input.value.trim().toLowerCase();
  }

  // ==========================================
  // BUSCAR PRODUCTO
  // ==========================================

  buscarProducto(event: Event): void {
    event.preventDefault();

    if (!this.terminoBusqueda) {
      this.productosFiltrados = [...this.listaProductos];

      return;
    }

    this.productosFiltrados = this.listaProductos.filter(
      (producto) =>
        producto.nombreProducto.toLowerCase().includes(this.terminoBusqueda) ||
        producto.sku.toLowerCase().includes(this.terminoBusqueda),
    );
  }

  // ==========================================
  // FILTRAR POR ESTADO
  // ==========================================

  filtrarPorEstado(estado: string): void {
    if (estado === 'todos') {
      this.productosFiltrados = [...this.listaProductos];

      return;
    }

    this.productosFiltrados = this.listaProductos.filter(
      (producto) => producto.estado.toLowerCase() === estado.toLowerCase(),
    );
  }

  // ==========================================
  // OBTENER PROVEEDORES DEL PRODUCTO
  // ==========================================

  obtenerProveedoresProducto(idProducto: string): Proveedor[] {
    const relaciones = this.listaProductosProveedores.filter(
      (relacion) => relacion.idProducto === idProducto,
    );

    return relaciones
      .map((relacion) =>
        this.listaProveedores.find((proveedor) => proveedor.id === relacion.idProveedor),
      )
      .filter((proveedor): proveedor is Proveedor => proveedor !== undefined);
  }

  // ==========================================
  // ELIMINAR PRODUCTO
  // ==========================================

  eliminarProducto(producto: Producto): void {
    const confirmar = confirm(
      `¿Está seguro de que desea eliminar el producto "${producto.nombreProducto}"?`,
    );

    if (!confirmar) {
      return;
    }

    console.log('Producto seleccionado para eliminar:', producto);

    // ========================================
    // BUSCAR RELACIÓN PRODUCTO - PROVEEDOR
    // ========================================

    this.productoProveedorService.obtenerProductosProveedores().subscribe({
      next: (relaciones) => {
        const relacion = relaciones.find((relacion) => relacion.idProducto === producto.id);

        // ==================================
        // SI NO TIENE RELACIÓN
        // ==================================

        if (!relacion) {
          console.warn('El producto no tiene una relación con proveedor');

          this.eliminarProductoDeApi(producto.id);

          return;
        }

        console.log('Relación encontrada:', relacion);

        // ==================================
        // ELIMINAR RELACIÓN
        // ==================================

        this.productoProveedorService.eliminarRelacion(relacion.id ?? '').subscribe({
          next: () => {
            console.log('Relación producto-proveedor eliminada');

            // ==========================
            // ELIMINAR PRODUCTO
            // ==========================

            this.eliminarProductoDeApi(producto.id);
          },

          error: (error) => {
            console.error('Error al eliminar relación:', error);

            alert('No se pudo eliminar la relación con el proveedor');
          },
        });
      },

      error: (error) => {
        console.error('Error al buscar relación:', error);

        alert('No se pudo obtener la relación del producto');
      },
    });
  }

  // ==========================================
  // ELIMINAR PRODUCTO DE LA API
  // ==========================================

  private eliminarProductoDeApi(idProducto: string): void {
    this.productService.eliminarProducto(idProducto).subscribe({
      next: () => {
        console.log('Producto eliminado correctamente');

        alert('Producto eliminado correctamente');

        // Actualizar tabla
        this.cargarProductos();
      },

      error: (error) => {
        console.error('Error al eliminar producto:', error);

        alert('No se pudo eliminar el producto');
      },
    });
  }

  // ==========================================
  // ACCIONES DE LA TABLA
  // ==========================================

  ejecutarAccion(accion: string, producto: Producto): void {
    // ========================================
    // EDITAR
    // ========================================

    if (accion === 'bi bi-pencil-fill') {
      this.router.navigate(['/sinertech/dashboard-admin/registro-producto', producto.id]);
    }

    // ========================================
    // ELIMINAR
    // ========================================

    if (accion === 'bi bi-trash-fill') {
      this.eliminarProducto(producto);
    }
  }
}
