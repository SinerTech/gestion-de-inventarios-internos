import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Producto } from '../../../../models/producto.models';
import { Proveedor } from '../../../../models/proveedor.models';
import { Motivo } from '../../../../models/motivo.models';
import { MovimientoInventarioService } from '../../../../services/movimiento-inventario/movimiento-inventario-service';
import { ProductoService } from '../../../../services/producto/producto-service';
import { MotivoService } from '../../../../services/motivo/motivo-service';
import { TipoMovimientoService } from '../../../../services/tipo-movimiento/tipo-movimiento-service';
import { MovimientoInventario } from '../../../../models/movimiento-inventario.models';


@Component({
    imports: [ReactiveFormsModule],
    selector: 'app-ajuste-stock',
    styleUrl: './ajuste-stock.css',
    templateUrl: './ajuste-stock.html',
})

export class AjusteStock implements OnInit {
    listaProductos: Producto[] = []
    listaProveedores: Proveedor[] = []
    listaMotivos: Motivo[] = []
    private idUsuarioActual = "1"

    private formBuilder = inject(FormBuilder)
    private movimientoService = inject(MovimientoInventarioService)
    private productosService = inject(ProductoService)
    private motivoService = inject(MotivoService)
    private tiposMovimientoService = inject(TipoMovimientoService)
    private cdr = inject(ChangeDetectorRef)

    formularioAjuste: FormGroup = this.formBuilder.group({
            idProducto: ['', Validators.required],
            tipoAjuste: ['', Validators.required],
            idMotivo: ['', Validators.required],
            cantidadMovimiento: ['', [Validators.required, Validators.min(1)]],
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
        this.motivoService.obtenerMotivos().subscribe({
            next: (data) => {
                console.log(data);
                this.listaMotivos = data; 
            },
            error: (e) =>
                console.error('Error al cargar motivos'),
            complete: () => {
                this.cdr.detectChanges();
                console.info('complete')
            }
        });
    }

    get motivosAjusteFiltrados() {
        const tipo = this.formularioAjuste.get('tipoAjuste')?.value;
        const idsAjustePositivo = ['3', '4'];
        const idsAjusteNegativo = ['5', '6', '7']

        if (tipo === 'ajuste_positivo') {
            return this.listaMotivos.filter(motivo => idsAjustePositivo.includes(motivo.id));
        } else if (tipo === 'ajuste_negativo') {
            return this.listaMotivos.filter(
                motivo => idsAjusteNegativo.includes(motivo.id)
            );
        }
        return [];
    }

    onEnviarAjuste(): void {
        if (this.formularioAjuste.invalid) {
            this.formularioAjuste.markAllAsTouched();
            return;
        }
        this.tiposMovimientoService.obtenerTiposMovimiento().subscribe({
            next: (data) => {
                const tipoAjuste = data.find(
                    tipo => tipo.nombreTipoMovimiento === "Ajuste"
                )
            if (!tipoAjuste) {
                console.error('No se encontro el tipo de Ajuste');
                return;
            }
            const movimiento: MovimientoInventario = {
                idProducto: this.formularioAjuste.value.idProducto,
                cantidadMovimiento: this.formularioAjuste.value.cantidadMovimiento,
                idMotivo: this.formularioAjuste.value.idMotivo,
                observaciones: this.formularioAjuste.value.observaciones,
                idUsuario: this.idUsuarioActual,
                idTipoMovimiento: tipoAjuste.id,
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
                        console.error('No se encontro el producto seleccionado');
                        return;
                    }
                    const tipoAjuste = this.formularioAjuste.value.tipoAjuste;
                    const cantidad = this.formularioAjuste.value.cantidadMovimiento;
                    const nuevaCantidad = 
                        tipoAjuste === 'ajuste_positivo' 
                            ? producto.cantidadExistente + cantidad
                            : producto.cantidadExistente - cantidad;

                    const productoActualizado: Producto = {
                        id: producto.id,
                        sku: producto.sku,
                        nombreProducto: producto.nombreProducto,
                        idCategoria: producto.idCategoria,
                        precioUnitario: producto.precioUnitario,
                        cantidadExistente: nuevaCantidad,
                        estado: producto.estado,
                        ultimoIngreso: movimiento.fechaHoraMovimiento
                    };
                    this.productosService.actualizarCantidadExistente(producto.id, productoActualizado).subscribe({
                        next: () => {
                            console.log('Producto actualizado');
                            this.formularioAjuste.reset();
                        },
                        error: (e) => {
                            console.error('Error al actualizar el producto', e)
                        }
                    });
                },
                error: (e) => {
                    console.error('Error al registrar movimiento', e);
                }
            });
            },
            error: (e) => {
                console.error('Error al buscar el tipo de movimiento', e)
            },
            complete: () => {
                console.info('complete');
                this.cdr.detectChanges();
            }
        });
    }
}