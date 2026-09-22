import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MovimientoInventarioService } from '../../../../services/movimiento-inventario/movimiento-inventario-service';
import { ProductoService } from '../../../../services/producto/producto-service';
import { Producto } from '../../../../models/producto.models';
import { Proveedor } from '../../../../models/proveedor.models';
import { ProveedorService } from '../../../../services/proveedor/proveedor-service';
import { Motivo } from '../../../../models/motivo.models';
import { MotivoService } from '../../../../services/motivo/motivo-service';
import { TipoMovimientoService } from '../../../../services/tipo-movimiento/tipo-movimiento-service';
import { MovimientoInventario } from '../../../../models/movimiento-inventario.models';
import { ProductoProveedor } from '../../../../models/producto-proveedor';
import { ProductoProveedorService } from '../../../../services/producto-proveedor/producto-proveedor-service';
import { AuthService } from '../../../../services/auth/auth-service';

@Component({
    imports: [ReactiveFormsModule],
    selector: 'app-ingreso-stock',
    styleUrl: './ingreso-stock.css',
    templateUrl: './ingreso-stock.html',
})
export class IngresoStock implements OnInit {
    listaProductos: Producto[] = []
    listaProveedores: Proveedor[] = []
    listaMotivos: Motivo[] = []

    private formBuilder = inject(FormBuilder)
    private movimientoService = inject(MovimientoInventarioService)
    private productosService = inject(ProductoService)
    private proveedorService = inject(ProveedorService)
    private motivoService = inject(MotivoService)
    private tiposMovimientoService = inject(TipoMovimientoService)
    private productoProveedorService = inject(ProductoProveedorService)
    private cdr = inject(ChangeDetectorRef)
    private authService = inject(AuthService)

    formularioIngreso: FormGroup = this.formBuilder.group({
            idProducto: ['', Validators.required],
            cantidadMovimiento: ['', [Validators.required, Validators.min(1)]],
            idProveedor: ['', Validators.required],
            numeroLoteFactura: ['', Validators.required],
            idMotivo: ['', Validators.required],
            observaciones: ['']
        });

    ngOnInit(): void {
        this.productosService.obtenerListaProductos().subscribe({
            next: (data) => {
                console.log(data);
                this.listaProductos = data;
            },
            error: (e) =>
                console.error('Error al cargar productos', e),
            complete: () => {
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
                console.error('Error al cargar productos', e),
            complete: () => {
                this.cdr.detectChanges();
                console.info('complete');
            }
        });

        this.motivoService.obtenerMotivos().subscribe({
            next: (data) => {
                console.log(data);
                this.listaMotivos = data;
            },
            error: (e) =>
                console.error('Error al cargar motivos', e),
            complete: () => {
                this.cdr.detectChanges();
                console.info('complete');
            }
        });
    };

    get motivosIngresoFiltrados() {
        const idsIngreso = ['1', '2']
        return this.listaMotivos.filter(motivo => idsIngreso.includes(motivo.id));
    }

    onEnviarIngreso(): void {
        if (this.formularioIngreso.invalid) {
            this.formularioIngreso.markAllAsTouched();
            return;
        }
        this.tiposMovimientoService.obtenerTiposMovimiento().subscribe({
            next: (data) => {
                const tipoIngreso = data.find(
                    tipo => tipo.nombreTipoMovimiento === 'Ingreso'
                );
                if (!tipoIngreso) {
                    console.error("No se encontró el tipo de movimiento 'Ingreso'");
                    return;
                }
                const usuarioActual = this.authService.obtenerUsuarioActual();
                if (!usuarioActual) {
                    console.error('No hay un usuario logueado');
                    return;
                }
                const movimiento: MovimientoInventario = {
                    idProducto: this.formularioIngreso.value.idProducto,
                    cantidadMovimiento: this.formularioIngreso.value.cantidadMovimiento,
                    idProveedor: this.formularioIngreso.value.idProveedor,
                    numeroLoteFactura: this.formularioIngreso.value.numeroLoteFactura,
                    idMotivo: this.formularioIngreso.value.idMotivo,
                    observaciones: this.formularioIngreso.value.observaciones,
                    idUsuario: usuarioActual.id,
                    idTipoMovimiento: tipoIngreso.id,
                    fechaHoraMovimiento: new Date().toISOString()
                };
                this.movimientoService.registrarMovimiento(movimiento).subscribe({
                    next: () => {
                        console.log('Movimiento enviado:', movimiento);
                        console.log('ID del producto en movimiento:', movimiento.idProducto);
                        console.log('Lista de productos:', this.listaProductos);
                        const producto = this.listaProductos.find(
                            producto => producto.id === movimiento.idProducto
                        );
                        if (!producto) {
                            console.error('No se encontró el producto seleccionado.')
                            return;
                        }
                        const productoActualizado: Producto = {
                            id: producto.id,
                            sku: producto.sku,
                            nombreProducto: producto.nombreProducto,
                            idCategoria: producto.idCategoria,
                            precioUnitario: producto.precioUnitario,
                            cantidadExistente: producto.cantidadExistente + movimiento.cantidadMovimiento,
                            estado: producto.estado,
                            ultimoIngreso: movimiento.fechaHoraMovimiento
                        };
                        const productoProveedor: ProductoProveedor = {
                            idProducto: this.formularioIngreso.value.idProducto,
                            idProveedor: this.formularioIngreso.value.idProveedor
                            };
                        this.productosService.actualizarCantidadExistente(producto.id, productoActualizado).subscribe({
                            next: () => {
                                console.log('Producto actualizado');
                            },
                            error: (e) => {
                                console.error('Error al actualizar el producto', e)
                            }
                        });
                        this.productoProveedorService.registrarRelacion(productoProveedor).subscribe({
                            next: () => {
                                console.log('Relacion registrada');
                                this.formularioIngreso.reset();
                            },
                            error: (e) => {
                                console.error('Error al registrar la relación', e)
                            }
                        });
                    },
                    error: (e) => {
                        console.error('Error al registrar movimiento', e);
                    }
                });
            },
            error: (e) => {
                console.error('Error al buscar el tipo de movimiento', e);
            },
            complete: () => {
                this.cdr.detectChanges();
                console.info('complete');
            }
        });
    }   
}
