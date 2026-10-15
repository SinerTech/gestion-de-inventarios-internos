import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MovimientoInventarioService } from '../../../../services/movimiento-inventario/movimiento-inventario-service';
import { ProductoService } from '../../../../services/producto/producto-service';
import { Producto } from '../../../../models/producto.models';
import { Proveedor } from '../../../../models/proveedor.models';
import { ProveedorService } from '../../../../services/proveedor/proveedor-service';
import { Motivo } from '../../../../models/motivo.models';
import { MotivoService } from '../../../../services/motivo/motivo-service';
import { AuthService } from '../../../../services/auth/auth-service';

@Component({
    imports: [ReactiveFormsModule],
    selector: 'app-ingreso-stock',
    styleUrl: './ingreso-stock.css',
    templateUrl: './ingreso-stock.html',
})
export class IngresoStock implements OnInit {
    listaProductos: Producto[] = [];
    listaProveedores: Proveedor[] = [];
    listaMotivos: Motivo[] = [];

    private formBuilder = inject(FormBuilder);
    private movimientoService = inject(MovimientoInventarioService);
    private productosService = inject(ProductoService);
    private proveedorService = inject(ProveedorService);
    private motivoService = inject(MotivoService);
    private authService = inject(AuthService);
    private cdr = inject(ChangeDetectorRef)

    formularioIngreso: FormGroup = this.formBuilder.group({
        idProducto: ['', Validators.required],
        cantidadMovimiento: ['', [Validators.required, Validators.min(1), Validators.max(200)]],
        idProveedor: [''],
        numeroLoteFactura: [''],
        idMotivo: ['', Validators.required],
        observaciones: ['']
    });

    ngOnInit(): void {
        this.productosService.obtenerListaProductos().subscribe({
            next: data => this.listaProductos = data,
            error: e => console.error('Error al cargar productos', e)
        });

        this.proveedorService.obtenerProveedores().subscribe({
            next: data => {
                this.listaProveedores = data;
                this.cdr.detectChanges();
            },
            error: e => {
                console.error('Error al cargar proveedores', e);
                this.cdr.detectChanges();
            }
        });

        this.motivoService.obtenerMotivos().subscribe({
            next: data => {
                this.listaMotivos = data;
                this.cdr.detectChanges();
            },
            error: e => {
                console.error('Error al cargar motivos', e);
                this.cdr.detectChanges();
            }
        });

        this.formularioIngreso.get('idMotivo')?.valueChanges.subscribe(() => {
            this.actualizarValidadoresCompra();
        });
    }

    get motivosIngresoFiltrados(): Motivo[] {
        const nombres = [
            'Compra a proveedor',
            'Devolucion de cliente'
        ];

        return this.listaMotivos.filter(motivo =>
            nombres.includes(motivo.nombreMotivo)
        );
    }

    get esCompraProveedor(): boolean {
        const idSeleccionado = String(
            this.formularioIngreso.get('idMotivo')?.value ?? ''
        );

        const motivo = this.listaMotivos.find(
            item => String(item.id) === idSeleccionado
        );

        return motivo?.nombreMotivo === 'Compra a proveedor';
    }

    private actualizarValidadoresCompra(): void {
        const proveedor = this.formularioIngreso.get('idProveedor');
        const lote = this.formularioIngreso.get('numeroLoteFactura');

        if (this.esCompraProveedor) {
            proveedor?.setValidators([Validators.required]);
            lote?.setValidators([Validators.required]);
        } else {
            proveedor?.clearValidators();
            lote?.clearValidators();
            proveedor?.setValue('');
            lote?.setValue('');
        }

        proveedor?.updateValueAndValidity({ emitEvent: false });
        lote?.updateValueAndValidity({ emitEvent: false });
    }

    onEnviarIngreso(): void {
        if (this.formularioIngreso.invalid) {
            this.formularioIngreso.markAllAsTouched();
            return;
        }

        const usuarioActual = this.authService.obtenerUsuarioActual();

        if (!usuarioActual) {
            console.error('No hay un usuario logueado.');
            return;
        }

        const datos = this.formularioIngreso.getRawValue();

        this.movimientoService.registrarIngreso({
            id_producto: Number(datos.idProducto),
            cantidad_movimiento: Number(datos.cantidadMovimiento),
            id_motivo: Number(datos.idMotivo),
            id_usuario: Number(usuarioActual.id),
            observaciones: datos.observaciones ?? '',
            id_proveedor: datos.idProveedor
                ? Number(datos.idProveedor)
                : null,
            numero_lote_factura: datos.numeroLoteFactura?.trim() || null
        }).subscribe({
            next: respuesta => {
                console.log(respuesta.mensaje);
                this.formularioIngreso.reset();
            },
            error: error => {
                console.error(
                    'No se pudo registrar el ingreso.',
                    error.error ?? error
                );
            }
        });
    }
}