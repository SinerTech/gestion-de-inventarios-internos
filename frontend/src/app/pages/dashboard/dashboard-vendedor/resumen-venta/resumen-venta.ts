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

import { PedidoService } from '../../../../services/pedido/pedido-service';
import { Cliente } from '../../../../models/cliente.models';
import { ClienteService } from '../../../../services/cliente/cliente-service';
import {ProductoService } from '../../../../services/producto/producto-service';
import {Producto} from '../../../../models/producto.models';
import { forkJoin } from 'rxjs';
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
  private productoService = inject(ProductoService);
  private cdr = inject(ChangeDetectorRef);
  private clienteService = inject(ClienteService);
  private authService = inject(AuthService)


  ngOnInit(): void {
    this.productoService.obtenerListaProductos().subscribe({
      next: (productos) => {
        this.productos = productos;
        this.cargandoProductos = false;
        this.cdr.markForCheck();

        console.log('Productos cargados:', this.productos);
      },
      error: (error) => {
        this.mensajeErrorProductos =
          'No se pudieron cargar los productos. Intentá nuevamente más tarde.';
        this.cargandoProductos = false;

        console.error('Error al cargar productos:', error);
        this.cdr.markForCheck();
      }
    });

    this.clienteService.obtenerClientes().subscribe({
      next: (clientes) => {
        this.clientes = clientes;

        const consumidorFinal = clientes.find(cliente =>
          cliente.nombreCliente === 'Consumidor' &&
          cliente.apellidoCliente === 'Final'
        );

        this.ventaForm.controls.cliente.setValue(
          consumidorFinal?.id ?? ''
        );

        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error al cargar clientes:', error);
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
    this.mensajeErrorVenta = 'Agregá al menos un producto al pedido.';
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
    item.precioUnitario <= 0 ||
    !Number.isInteger(Number(item.idProducto)) ||
    Number(item.idProducto) <= 0
  )) {
    this.mensajeErrorVenta =
      'Revisá los productos, las cantidades y los precios.';
    return;
  }

  const idCliente = Number(cliente.id);
  const idUsuario = Number(usuarioActual.idUsuario);

  if (
    !Number.isInteger(idCliente) || idCliente <= 0 ||
    !Number.isInteger(idUsuario) || idUsuario <= 0
  ) {
    this.mensajeErrorVenta =
      'El cliente o el usuario no tiene un ID numérico válido para Django.';
    return;
  }

  const fechaHora = new Date().toISOString();

  const venta = {
    id_cliente: idCliente,
    id_usuario: idUsuario,
    fecha_hora_pedido: fechaHora,
    metodo_pago: datosVenta.metodoPago ?? '',
    observaciones: datosVenta.observaciones ?? '',
    detalles: items.map(item => ({
      id_producto: Number(item.idProducto),
      cantidad: item.cantidad,
      precio_unitario: item.precioUnitario
    }))
  };

  this.guardandoVenta = true;
  this.ventaForm.disable();

  this.pedidoService.registrarVenta(venta).subscribe({
    next: (respuesta) => {
      this.idPedidoVenta = String(respuesta.id_pedido);
      this.itemsRecibo = items;

      this.clienteVenta =
        cliente.nombreCliente + ' ' + cliente.apellidoCliente;

      this.observacionesVenta = datosVenta.observaciones ?? '';
      this.metodoPagoSeleccionado = datosVenta.metodoPago ?? '';

      // El total guardado y calculado por Django es la fuente de verdad.
      this.subtotal = respuesta.total;
      this.iva = 0;
      this.total = respuesta.total;

      this.itemsVenta = [];

      this.ventaForm.reset({
        producto: '',
        cantidad: 1,
        cliente: cliente.id,
        metodoPago: '',
        observaciones: ''
      });

      this.ventaFinalizada = true;
      this.guardandoVenta = false;
      this.ventaForm.enable();
      this.cdr.markForCheck();
    },
    error: (error) => {
      this.guardandoVenta = false;

      this.mensajeErrorVenta =
        error instanceof Error
          ? error.message
          : 'No se pudo registrar la venta en Django.';

      // Evitamos reintentar automáticamente una petición cuyo resultado
      // podría ser incierto hasta comprobar si Django guardó el pedido.
      this.ventaPendienteRevision = true;
      this.ventaForm.disable();

      console.error('Error al registrar la venta en Django:', error);
      this.cdr.markForCheck();
    }
  });
}
}