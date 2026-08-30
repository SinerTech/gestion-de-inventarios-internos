import { Component } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';

@Component({
  selector: 'app-registro-producto',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './registro-producto.html',
  styleUrl: './registro-producto.css',
})
export class RegistroProducto {
  productoForm;

  constructor(private fb: FormBuilder) {
    this.productoForm = this.fb.group({
      // SKU
      sku: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
          Validators.pattern(/^[A-Za-z0-9-]+$/),
        ],
      ],

      // PRODUCTO
      nombre: [
        '',
        [Validators.required, Validators.minLength(3), Validators.maxLength(50), this.nombreValido],
      ],

      categoria: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],

      stock: [0, [Validators.required, Validators.min(0), Validators.max(100000)]],

      precio: [0, [Validators.required, Validators.min(0.01), Validators.max(999999999)]],

      estado: ['activo', [Validators.required]],

      // PROVEEDOR
      proveedor: this.fb.group({
        proveedorExistente: ['', [Validators.required]],

        // DATOS DEL NUEVO PROVEEDOR
        nuevoProveedor: this.fb.group({
          razonSocial: [''],

          cuit: [''],

          telefono: [''],

          email: [''],
        }),
      }),
    });

    // Detectar cambio de proveedor
    this.productoForm.controls.proveedor.controls.proveedorExistente.valueChanges.subscribe(
      (valor) => {
        const nuevoProveedor = this.productoForm.controls.proveedor.controls.nuevoProveedor;

        const razonSocial = nuevoProveedor.controls.razonSocial;
        const cuit = nuevoProveedor.controls.cuit;
        const telefono = nuevoProveedor.controls.telefono;
        const email = nuevoProveedor.controls.email;

        if (valor === 'nuevo') {
          razonSocial.setValidators([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
          ]);

          cuit.setValidators([
            Validators.required,
            Validators.pattern(/^\d{2}-\d{8}-\d{1}$/),
            this.cuitValido,
          ]);

          telefono.setValidators([Validators.required, Validators.pattern(/^[0-9+\-\s()]{8,20}$/)]);

          email.setValidators([Validators.required, Validators.email]);
        } else {
          razonSocial.clearValidators();
          cuit.clearValidators();
          telefono.clearValidators();
          email.clearValidators();

          razonSocial.reset('');
          cuit.reset('');
          telefono.reset('');
          email.reset('');
        }

        // Actualizar validaciones
        razonSocial.updateValueAndValidity();
        cuit.updateValueAndValidity();
        telefono.updateValueAndValidity();
        email.updateValueAndValidity();
      },
    );
  }

  // VALIDACIÓN PERSONALIZADA DEL NOMBRE

  nombreValido(control: AbstractControl): ValidationErrors | null {
    const valor = control.value;

    if (!valor) {
      return null;
    }

    const contieneLetras = /[a-zA-ZáéíóúÁÉÍÓÚñÑ]/.test(valor);

    if (!contieneLetras) {
      return {
        nombreInvalido: true,
      };
    }

    return null;
  }

  // VALIDACIÓN PERSONALIZADA DEL CUIT

  cuitValido(control: AbstractControl): ValidationErrors | null {
    const valor = control.value;

    if (!valor) {
      return null;
    }

    const formatoCUIT = /^\d{2}-\d{8}-\d{1}$/;

    if (!formatoCUIT.test(valor)) {
      return {
        cuitInvalido: true,
      };
    }

    return null;
  }

  // CREAR

  registrarProducto(): void {
    if (this.productoForm.valid) {
      console.log('Producto creado:', this.productoForm.value);

      alert('Producto creado correctamente');

      this.limpiarFormulario();
    } else {
      this.productoForm.markAllAsTouched();
    }
  }

  // EDITAR

  editarProducto(): void {
    if (this.productoForm.valid) {
      console.log('Producto editado:', this.productoForm.value);

      alert('Producto editado correctamente');
    } else {
      this.productoForm.markAllAsTouched();
    }
  }

  // ELIMINAR

  eliminarProducto(): void {
    const confirmar = confirm('¿Está seguro de que desea eliminar este producto?');

    if (confirmar) {
      console.log('Producto eliminado:', this.productoForm.value);

      alert('Producto eliminado correctamente');

      this.limpiarFormulario();
    }
  }

  // LIMPIAR

  limpiarFormulario(): void {
    this.productoForm.reset({
      sku: '',

      nombre: '',

      categoria: '',

      stock: 0,

      precio: 0,

      estado: 'activo',

      proveedor: {
        proveedorExistente: '',

        nuevoProveedor: {
          razonSocial: '',
          cuit: '',
          telefono: '',
          email: '',
        },
      },
    });
  }
}
