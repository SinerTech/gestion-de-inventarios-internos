import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

@Component({
  selector: 'app-resumen-venta',
  imports: [ReactiveFormsModule],
  templateUrl: './resumen-venta.html',
  styleUrl: './resumen-venta.css',
})
export class ResumenVenta {

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

  productos = [
    {
      valor: 'teclado',
      nombre: 'Teclado Mecánico',
      precio: 25000
    },
    {
      valor: 'mouse',
      nombre: 'Mouse Gamer',
      precio: 18500
    },
    {
      valor: 'monitor',
      nombre: 'Monitor LED',
      precio: 120000
    },
    {
      valor: 'auriculares',
      nombre: 'Auriculares',
      precio: 32000
    },
    {
      valor: 'notebook',
      nombre: 'Notebook',
      precio: 450000
    }
  ];

  finalizarTransaccion() {
    if (this.ventaForm.invalid) {
      this.ventaForm.markAllAsTouched();
      return;
    }

    const productoEncontrado = this.productos.find(
      producto =>
        producto.valor === this.ventaForm.value.producto
    );

    if (!productoEncontrado) {
      return;
    }

    this.productoSeleccionado = productoEncontrado.nombre;
    this.precioUnitario = productoEncontrado.precio;

    this.cantidadVendida =
      this.ventaForm.value.cantidad ?? 1;

    this.subtotal =
      this.precioUnitario * this.cantidadVendida;

    this.iva =
      this.subtotal * 0.21;

    this.total =
      this.subtotal + this.iva;

    this.metodoPagoSeleccionado =
      this.ventaForm.value.metodoPago ?? '';

    this.ventaFinalizada = true;

    console.log('Venta registrada:', this.ventaForm.value);
  }
}