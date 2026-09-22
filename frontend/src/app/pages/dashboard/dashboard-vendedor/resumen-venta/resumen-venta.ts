import {
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
} from '@angular/core';

import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { Pedido } from '../../../../models/pedido.models';
import { PedidoService } from '../../../../services/pedido/pedido-service';
import { DetallePedidoService } from '../../../../services/detalle-pedido/detalle-pedido-service';
import { Cliente } from '../../../../models/cliente.models';
import { ClienteService } from '../../../../services/cliente/cliente-service';
import {ProductoService } from '../../../../services/producto/producto-service';
import {Producto} from '../../../../models/producto.models';
import { forkJoin, switchMap, finalize, from, concatMap, toArray } from 'rxjs';
import { MovimientoInventario } from '../../../../models/movimiento-inventario.models';
import { MovimientoInventarioService } from '../../../../services/movimiento-inventario/movimiento-inventario-service';
import { TipoMovimientoService } from '../../../../services/tipo-movimiento/tipo-movimiento-service'
import { MotivoService } from '../../../../services/motivo/motivo-service';
import { AuthService } from '../../../../services/auth/auth-service';

interface ItemVenta {
  idProducto: string;
  nombreProducto: string;
  cantidad: number;
  precioUnitario: number;
}

@Component({
  selector: 'app-resumen-venta',
  imports: [ReactiveFormsModule],
  templateUrl: './resumen-venta.html',
  styleUrl: './resumen-venta.css',
})
export class ResumenVenta implements OnInit {

  ventaForm = new FormGroup({
    producto: new FormControl('', Validators.required),
    cantidad: new FormControl(1, [
      Validators.required,
      Validators.min(1)
    ]),
    cliente: new FormControl('', Validators.required),
    metodoPago: new FormControl('', Validators.required),
    observaciones: new FormControl('')
  });

  ventaFinalizada = false;
  productoSeleccionado = '';
  precioUnitario = 0;
  cantidadVendida = 0;
  subtotal = 0;
  iva = 0;
  total = 0;
  metodoPagoSeleccionado = '';

  productos: Producto[] = [];
  clientes: Cliente[] = [];
  itemsVenta: ItemVenta[] = [];
  itemsRecibo: ItemVenta[] = [];
  idPedidoVenta = '';

  cargandoProductos = true;
  mensajeErrorProductos = '';
  mensajeErrorVenta = '';

  guardandoVenta = false;
  ventaPendienteRevision = false;

  clienteVenta = '';
  observacionesVenta = '';

  private pedidoService = inject(PedidoService);
  private detallePedidoService = inject(DetallePedidoService);
  private productoService = inject(ProductoService);
  private movimientoService = inject(MovimientoInventarioService);
  private tipoMovimientoService = inject(TipoMovimientoService);
  private motivoService = inject(MotivoService);
  private cdr = inject(ChangeDetectorRef);
  private clienteService = inject(ClienteService);
  private authService = inject(AuthService)


  ngOnInit(): void {
  forkJoin({
    productos: this.productoService.obtenerListaProductos(),
    clientes: this.clienteService.obtenerClientes()
  }).subscribe({
    next: ({ productos, clientes }) => {
      this.productos = productos;
      this.clientes = clientes;

      const consumidorFinal = clientes.find(cliente =>
        cliente.nombreCliente === 'Consumidor' &&
        cliente.apellidoCliente === 'Final'
      );

      this.ventaForm.controls.cliente.setValue(
        consumidorFinal?.id ?? ''
      );

      this.cargandoProductos = false;
      this.cdr.markForCheck();
    },
    error: (error) => {
      this.mensajeErrorProductos =
        'No se pudieron cargar los productos o los clientes. ' +
        'Intentá nuevamente más tarde.';

      this.cargandoProductos = false;
      console.error('Error al cargar los datos de venta:', error);
      this.cdr.markForCheck();
    }
  });
}
  agregarProducto(): void {
    if (this.guardandoVenta || this.ventaPendienteRevision) {
    return;
  }
    this.mensajeErrorVenta = '';

    const controlProducto = this.ventaForm.controls.producto;
    const controlCantidad = this.ventaForm.controls.cantidad;

    controlProducto.markAsTouched();
    controlCantidad.markAsTouched();

    if (controlProducto.invalid || controlCantidad.invalid) {
      return;
    }

    const producto = this.productos.find(
      producto =>producto.id === controlProducto.value
    );

    if (!producto || producto.estado !== 'Activo') {
      this.mensajeErrorVenta = 'Selecciona un producto activo';
      return;
    }

    const cantidad = controlCantidad.value;

    if (cantidad == null || !Number.isInteger(cantidad) || cantidad < 1) {
      this.mensajeErrorVenta = 'Ingresa una cantidad entera mayor a 0';
      return;
    }

    const itemExistente = this.itemsVenta.find(
      item => item.idProducto === producto.id
    );

    const cantidadTotal = (itemExistente?.cantidad ?? 0) + cantidad;

    if (cantidadTotal > producto.cantidadExistente) {
      this.mensajeErrorVenta = 'Stock insuficiente, lo disponible es: ' +
      producto.cantidadExistente;
      return;
  }
    if (itemExistente) {
      this.itemsVenta = this.itemsVenta.map(item =>
      item.idProducto === producto.id
        ? { ...item, cantidad: cantidadTotal }
        : item
      );
    } else {
      this.itemsVenta = [
        ...this.itemsVenta,
        {
          idProducto: producto.id,
          nombreProducto: producto.nombreProducto,
          cantidad,
          precioUnitario: producto.precioUnitario
        }
      ];
    }

    this.ventaForm.patchValue({
      producto: '',
      cantidad: 1
  });

    controlProducto.markAsUntouched();
    controlCantidad.markAsUntouched();
    this.ventaFinalizada = false;
  }
quitarProducto(idProducto: string): void {
  if (this.guardandoVenta || this.ventaPendienteRevision) {
    return;

  }

  this.itemsVenta = this.itemsVenta.filter(
    item => item.idProducto !== idProducto
  );

  this.mensajeErrorVenta = '';
}

get subtotalPedido(): number {
  return this.itemsVenta.reduce(
    (total, item) => total + item.cantidad * item.precioUnitario,
    0
  );
}

finalizarTransaccion(): void {
  if (this.guardandoVenta || this.ventaPendienteRevision) {
    return;
  }

  this.mensajeErrorVenta = '';
  this.ventaFinalizada = false;

  const controlCliente = this.ventaForm.controls.cliente;
  const controlPago = this.ventaForm.controls.metodoPago;

  controlCliente.markAsTouched();
  controlPago.markAsTouched();

  if (controlCliente.invalid || controlPago.invalid) {
    return;
  }

  const datosVenta = this.ventaForm.getRawValue();

  const cliente = this.clientes.find(
    cliente => cliente.id === datosVenta.cliente
  );

  if (!cliente) {
    this.mensajeErrorVenta = 'Seleccioná un cliente válido.';
    return;
  }

  if (this.itemsVenta.length === 0) {
    this.mensajeErrorVenta =
      'Agregá al menos un producto al pedido.';
    return;
  }

  const usuarioActual = this.authService.obtenerUsuarioActual();
  if (!usuarioActual) {
    this.mensajeErrorVenta = 'No hay un usuario autenticado.';
    return;
  }

  const items = this.itemsVenta.map(item => ({ ...item }));

  if (items.some(item =>
    !Number.isInteger(item.cantidad) ||
    item.cantidad < 1 ||
    !Number.isFinite(item.precioUnitario) ||
    item.precioUnitario < 0
  )) {
    this.mensajeErrorVenta =
      'Revisá las cantidades y los precios del pedido.';
    return;
  }

  const subtotal = items.reduce(
    (suma, item) => suma + item.cantidad * item.precioUnitario,
    0
  );

  const iva = Math.round(subtotal * 0.21 * 100) / 100;
  const total = Math.round((subtotal + iva) * 100) / 100;
  const fechaHora = new Date().toISOString();

  let guardadoIniciado = false;
  let idPedidoCreado = '';

  this.guardandoVenta = true;
  this.ventaForm.disable();

  forkJoin({
    productos: this.productoService.obtenerListaProductos(),
    tipos: this.tipoMovimientoService.obtenerTiposMovimiento(),
    motivos: this.motivoService.obtenerMotivos()
  }).pipe(
    switchMap(({ productos, tipos, motivos }) => {
      this.productos = productos;

      const tipoSalida = tipos.find(
        tipo => tipo.nombreTipoMovimiento === 'Salida'
      );

      const motivoVenta = motivos.find(
        motivo => motivo.nombreMotivo === 'Venta'
      );

      if (!tipoSalida || !motivoVenta) {
        throw new Error(
          'Falta configurar el tipo Salida o el motivo Venta.'
        );
      }

      const productosActualizados = items.map(item => {
        const producto = productos.find(
          producto => producto.id === item.idProducto
        );

        if (!producto || producto.estado !== 'Activo') {
          throw new Error(
            'El producto ' + item.nombreProducto +
            ' ya no está disponible.'
          );
        }

        if (item.cantidad > producto.cantidadExistente) {
          throw new Error(
            'Stock insuficiente para ' + item.nombreProducto +
            '. Disponible: ' + producto.cantidadExistente
          );
        }

        return {
          ...producto,
          cantidadExistente:
            producto.cantidadExistente - item.cantidad
        };
      });

      const pedido: Omit<Pedido, 'id'> = {
        idCliente: cliente.id,
        idUsuario: usuarioActual.id,
        fechaHoraPedido: fechaHora,
        metodoPago: datosVenta.metodoPago ?? '',
        observaciones: datosVenta.observaciones ?? '',
        total
      };

      guardadoIniciado = true;

      return this.pedidoService.registrarPedido(pedido).pipe(
        switchMap(pedidoGuardado => {
          if (!pedidoGuardado.id) {
            throw new Error(
              'La API no devolvió el ID del pedido.'
            );
          }

          idPedidoCreado = pedidoGuardado.id;

          return from(items).pipe(
            concatMap(item => {
              const productoActualizado =
                productosActualizados.find(
                  producto => producto.id === item.idProducto
                )!;

              return this.detallePedidoService.registrarDetalle({
                idPedido: pedidoGuardado.id,
                idProducto: item.idProducto,
                cantidad: item.cantidad,
                precioUnitario: item.precioUnitario
              }).pipe(
                switchMap(() => {
                  const movimiento: MovimientoInventario = {
                    idProducto: item.idProducto,
                    idUsuario: usuarioActual.id,
                    idTipoMovimiento: tipoSalida.id,
                    idMotivo: motivoVenta.id,
                    cantidadMovimiento: item.cantidad,
                    fechaHoraMovimiento: fechaHora,
                    observaciones: datosVenta.observaciones ?? ''
                  };

                  return this.movimientoService
                    .registrarMovimiento(movimiento);
                }),
                switchMap(() =>
                  this.productoService.actualizarCantidadExistente(
                    item.idProducto,
                    productoActualizado
                  )
                )
              );
            }),
            toArray()
          );
        })
      );
    }),
    finalize(() => {
      this.guardandoVenta = false;

      if (!this.ventaPendienteRevision) {
        this.ventaForm.enable();
      }

      this.cdr.markForCheck();
    })
  ).subscribe({
    next: (productosGuardados) => {
      this.productos = this.productos.map(producto =>
        productosGuardados.find(
          actualizado => actualizado.id === producto.id
        ) ?? producto
      );

      this.idPedidoVenta = idPedidoCreado;
      this.itemsRecibo = items;
      this.clienteVenta =
        cliente.nombreCliente + ' ' + cliente.apellidoCliente;
      this.observacionesVenta = datosVenta.observaciones ?? '';
      this.metodoPagoSeleccionado = datosVenta.metodoPago ?? '';

      this.subtotal = subtotal;
      this.iva = iva;
      this.total = total;

      this.itemsVenta = [];

      this.ventaForm.reset({
        producto: '',
        cantidad: 1,
        cliente: cliente.id,
        metodoPago: '',
        observaciones: ''
      });

      this.ventaFinalizada = true;
    },
    error: (error) => {
      if (guardadoIniciado) {
        this.ventaPendienteRevision = true;

        this.mensajeErrorVenta =
          'No se pudo completar el guardado del pedido. ' +
          'Puede haber registros o cambios de stock . ' +
          'Revisá la base antes de volver a enviarlo.';
      } else {
        this.mensajeErrorVenta =
          error instanceof Error
            ? error.message
            : 'No se pu verificar los datos del pedido.';
      }

      console.error('Error al guardar el pedido:', error);
    }
  });
}
}