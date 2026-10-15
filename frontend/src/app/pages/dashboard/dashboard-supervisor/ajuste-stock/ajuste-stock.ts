import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Producto } from '../../../../models/producto.models';
import { Motivo } from '../../../../models/motivo.models';
import { MovimientoInventarioService } from '../../../../services/movimiento-inventario/movimiento-inventario-service';
import { ProductoService } from '../../../../services/producto/producto-service';
import { MotivoService } from '../../../../services/motivo/motivo-service';
import { AuthService } from '../../../../services/auth/auth-service';

@Component({
    imports: [ReactiveFormsModule],
    selector: 'app-ajuste-stock',
    styleUrl: './ajuste-stock.css',
    templateUrl: './ajuste-stock.html',
})
export class AjusteStock implements OnInit {
    listaProductos: Producto[] = [];
    listaMotivos: Motivo[] = [];

    private formBuilder = inject(FormBuilder);
    private movimientoService = inject(MovimientoInventarioService);
    private productosService = inject(ProductoService);
    private motivoService = inject(MotivoService);
    private authService = inject(AuthService);
    private cdr = inject(ChangeDetectorRef)

    formularioAjuste: FormGroup = this.formBuilder.group({
        idProducto: ['', Validators.required],
        tipoAjuste: ['', Validators.required],
        idMotivo: ['', Validators.required],
        cantidadMovimiento: ['', [Validators.required, Validators.min(1), Validators.max(200)]],
        observaciones: ['']
    });

    ngOnInit(): void {
        this.productosService.obtenerListaProductos().subscribe({
            next: data => {
                this.listaProductos = data;
                this.cdr.detectChanges();
            },
            error: e => {
                console.error('Error al cargar productos', e);
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

        this.formularioAjuste.get('tipoAjuste')?.valueChanges.subscribe(() => {
            // Evita conservar un motivo incompatible con el tipo elegido.
            this.formularioAjuste.get('idMotivo')?.reset('');
        });
    }

    get motivosAjusteFiltrados(): Motivo[] {
        const tipo = this.formularioAjuste.get('tipoAjuste')?.value;

        const motivosPositivos = [
            'Reconteo de inventario',
            'Producto encontrado',
        ];
        const motivosNegativos = [
            'Producto dañado',
            'Error de carga',
            'Perdida'
        ];

        const nombres = tipo === 'ajuste_positivo'
            ? motivosPositivos
            : tipo === 'ajuste_negativo'
                ? motivosNegativos
                : [];

        return this.listaMotivos.filter(motivo =>
            nombres.includes(motivo.nombreMotivo)
        );
        
    }

    onEnviarAjuste(): void {
        if (this.formularioAjuste.invalid) {
            this.formularioAjuste.markAllAsTouched();
            return;
        }

        const usuarioActual = this.authService.obtenerUsuarioActual();

        if (!usuarioActual) {
            console.error('No hay un usuario logueado.');
            return;
        }

        const datos = this.formularioAjuste.getRawValue();

        // Comprobación adicional para no enviar un motivo incompatible.
        const motivoValido = this.motivosAjusteFiltrados.some(
            motivo => String(motivo.id) === String(datos.idMotivo)
        );

        if (!motivoValido) {
            this.formularioAjuste.get('idMotivo')?.setErrors({
                motivoInvalido: true
            });
            this.formularioAjuste.get('idMotivo')?.markAsTouched();
            return;
        }

        this.movimientoService.registrarAjuste({
            id_producto: Number(datos.idProducto),
            cantidad_movimiento: Number(datos.cantidadMovimiento),
            id_motivo: Number(datos.idMotivo),
            id_usuario: Number(usuarioActual.id),
            observaciones: datos.observaciones ?? ''
        }).subscribe({
            next: respuesta => {
                console.log(respuesta.mensaje);
                this.formularioAjuste.reset();
            },
            error: error => {
                console.error(
                    'No se pudo registrar el ajuste.',
                    error.error ?? error
                );
            }
        });
    }
}
