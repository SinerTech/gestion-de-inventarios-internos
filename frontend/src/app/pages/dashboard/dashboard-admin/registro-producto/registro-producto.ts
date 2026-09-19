import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';

import { Categoria } from '../../../../models/categoria.models';
import { Proveedor } from '../../../../models/proveedor.models';
import { Producto } from '../../../../models/producto.models';
import { ProductoProveedor } from '../../../../models/producto-proveedor';

import { CategoriaService } from '../../../../services/categoria/categoria-service';
import { ProveedorService } from '../../../../services/proveedor/proveedor-service';
import { ProductoService } from '../../../../services/producto/producto-service';
import { ProductoProveedorService } from '../../../../services/producto-proveedor/producto-proveedor-service';

@Component({
  selector: 'app-registro-producto',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './registro-producto.html',
  styleUrl: './registro-producto.css',
})
export class RegistroProducto implements OnInit {
  productoForm;

  categorias: Categoria[] = [];
  proveedores: Proveedor[] = [];

  constructor(
    private fb: FormBuilder,
    private categoriaService: CategoriaService,
    private proveedorService: ProveedorService,
    private productoService: ProductoService,
    private productoProveedorService: ProductoProveedorService,
  ) {
    this.productoForm = this.fb.group({
      // =====================================================
      // SKU
      // =====================================================

      sku: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
          Validators.pattern(/^[A-Za-z0-9-]+$/),
        ],
      ],

      // =====================================================
      // PRODUCTO
      // =====================================================

      nombre: [
        '',
        [Validators.required, Validators.minLength(3), Validators.maxLength(50), this.nombreValido],
      ],

      categoria: ['', [Validators.required]],

      stock: [0, [Validators.required, Validators.min(0), Validators.max(100000)]],

      precio: [0, [Validators.required, Validators.min(0.01), Validators.max(999999999)]],

      estado: ['activo', [Validators.required]],

      // =====================================================
      // PROVEEDOR
      // =====================================================

      proveedor: this.fb.group({
        proveedorExistente: ['', [Validators.required]],

        // ===================================================
        // DATOS DEL NUEVO PROVEEDOR
        // ===================================================

        nuevoProveedor: this.fb.group({
          razonSocial: [''],

          cuit: [''],

          telefono: [''],

          email: [''],
        }),
      }),
    });

    // =====================================================
    // DETECTAR CAMBIO DE PROVEEDOR
    // =====================================================

    this.productoForm.controls.proveedor.controls.proveedorExistente.valueChanges.subscribe(
      (valor) => {
        const nuevoProveedor = this.productoForm.controls.proveedor.controls.nuevoProveedor;

        const razonSocial = nuevoProveedor.controls.razonSocial;

        const cuit = nuevoProveedor.controls.cuit;

        const telefono = nuevoProveedor.controls.telefono;

        const email = nuevoProveedor.controls.email;

        // =================================================
        // SI ES UN PROVEEDOR NUEVO
        // =================================================

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
        }

        // =================================================
        // SI ES UN PROVEEDOR EXISTENTE
        // =================================================
        else {
          razonSocial.clearValidators();
          cuit.clearValidators();
          telefono.clearValidators();
          email.clearValidators();

          razonSocial.reset('');
          cuit.reset('');
          telefono.reset('');
          email.reset('');
        }

        // =================================================
        // ACTUALIZAR VALIDACIONES
        // =================================================

        razonSocial.updateValueAndValidity();
        cuit.updateValueAndValidity();
        telefono.updateValueAndValidity();
        email.updateValueAndValidity();
      },
    );
  }

  // =====================================================
  // ON INIT
  // =====================================================

  ngOnInit(): void {
    this.cargarCategorias();

    this.cargarProveedores();
  }

  // =====================================================
  // VALIDACIÓN DEL NOMBRE
  // =====================================================

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

  // =====================================================
  // VALIDACIÓN DEL CUIT
  // =====================================================

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

  // =====================================================
  // CARGAR CATEGORÍAS
  // =====================================================

  cargarCategorias(): void {
    this.categoriaService.obtenerCategorias().subscribe({
      next: (categorias) => {
        this.categorias = categorias;

        console.log('Categorías recibidas:', categorias);
      },

      error: (error) => {
        console.error('Error al cargar categorías:', error);
      },
    });
  }

  // =====================================================
  // CARGAR PROVEEDORES
  // =====================================================

  cargarProveedores(): void {
    this.proveedorService.obtenerProveedores().subscribe({
      next: (proveedores) => {
        this.proveedores = proveedores;

        console.log('Proveedores recibidos:', proveedores);
      },

      error: (error) => {
        console.error('Error al cargar proveedores:', error);
      },
    });
  }

  // =====================================================
  // REGISTRAR PRODUCTO
  // =====================================================

  registrarProducto(): void {
    // ---------------------------------------------------
    // VALIDAR FORMULARIO
    // ---------------------------------------------------

    if (this.productoForm.invalid) {
      this.productoForm.markAllAsTouched();

      return;
    }

    // ---------------------------------------------------
    // OBTENER DATOS
    // ---------------------------------------------------

    const formulario = this.productoForm.getRawValue();

    const proveedorSeleccionado = formulario.proveedor?.proveedorExistente;

    // ---------------------------------------------------
    // CREAR OBJETO PRODUCTO
    // ---------------------------------------------------

    const producto: Producto = {
      id: '',

      sku: formulario.sku ?? '',

      nombreProducto: formulario.nombre ?? '',

      idCategoria: formulario.categoria ?? '',

      precioUnitario: formulario.precio ?? 0,

      cantidadExistente: formulario.stock ?? 0,

      estado: this.convertirEstado(formulario.estado ?? 'activo'),

      ultimoIngreso: new Date().toISOString(),
    };

    console.log('Producto que se enviará a la API:', producto);

    // =====================================================
    // PROVEEDOR NUEVO
    // =====================================================

    if (proveedorSeleccionado === 'nuevo') {
      const datosNuevoProveedor = formulario.proveedor?.nuevoProveedor;

      const nuevoProveedor: Proveedor = {
        id: '',

        razonSocial: datosNuevoProveedor?.razonSocial ?? '',

        cuit: datosNuevoProveedor?.cuit ?? '',

        telefonoProveedor: datosNuevoProveedor?.telefono ?? '',

        emailProveedor: datosNuevoProveedor?.email ?? '',
      };

      console.log('Nuevo proveedor que se enviará a la API:', nuevoProveedor);

      // ---------------------------------------------------
      // POST /proveedores
      // ---------------------------------------------------

      this.proveedorService.registrarProveedor(nuevoProveedor).subscribe({
        next: (proveedorCreado) => {
          console.log('Proveedor creado por la API:', proveedorCreado);

          // ------------------------------------------------
          // CREAR PRODUCTO Y RELACIÓN
          // ------------------------------------------------

          this.crearProductoYRelacion(producto, proveedorCreado.id);
        },

        error: (error) => {
          console.error('Error al registrar proveedor:', error);

          alert('No se pudo registrar el proveedor');
        },
      });

      return;
    }

    // =====================================================
    // PROVEEDOR EXISTENTE
    // =====================================================

    if (proveedorSeleccionado && proveedorSeleccionado !== 'nuevo') {
      this.crearProductoYRelacion(producto, proveedorSeleccionado);

      return;
    }
  }

  // =====================================================
  // CREAR PRODUCTO + RELACIÓN
  // =====================================================

  private crearProductoYRelacion(producto: Producto, idProveedor: string): void {
    // ---------------------------------------------------
    // POST /productos
    // ---------------------------------------------------

    this.productoService.registrarProducto(producto).subscribe({
      next: (productoCreado) => {
        console.log('Producto creado por la API:', productoCreado);

        // ------------------------------------------------
        // CREAR RELACIÓN
        // ------------------------------------------------

        const relacion: ProductoProveedor = {
          idProducto: productoCreado.id,

          idProveedor: idProveedor,
        };

        console.log('Relación producto-proveedor que se enviará:', relacion);

        // ------------------------------------------------
        // POST /productos-proveedores
        // ------------------------------------------------

        this.productoProveedorService.registrarRelacion(relacion).subscribe({
          next: (relacionCreada) => {
            console.log('Relación creada por la API:', relacionCreada);

            alert('Producto creado correctamente');

            this.limpiarFormulario();

            // Actualizamos la lista de proveedores
            // por si acabamos de crear uno nuevo.

            this.cargarProveedores();
          },

          error: (error) => {
            console.error('Error al registrar la relación producto-proveedor:', error);

            alert('El producto se creó, pero no se pudo asociar al proveedor');
          },
        });
      },

      error: (error) => {
        console.error('Error al registrar producto:', error);

        alert('No se pudo registrar el producto');
      },
    });
  }

  // =====================================================
  // CONVERTIR ESTADO
  // =====================================================

  convertirEstado(estado: string): 'Activo' | 'Inactivo' | 'Suspendido' {
    switch (estado) {
      case 'activo':
        return 'Activo';

      case 'inactivo':
        return 'Inactivo';

      case 'suspendido':
        return 'Suspendido';

      default:
        return 'Activo';
    }
  }

  // =====================================================
  // EDITAR
  // =====================================================

  editarProducto(): void {
    if (this.productoForm.valid) {
      console.log('Producto editado:', this.productoForm.value);

      alert('Producto editado correctamente');
    } else {
      this.productoForm.markAllAsTouched();
    }
  }

  // =====================================================
  // ELIMINAR
  // =====================================================

  eliminarProducto(): void {
    const confirmar = confirm('¿Está seguro de que desea eliminar este producto?');

    if (confirmar) {
      console.log('Producto eliminado:', this.productoForm.value);

      alert('Producto eliminado correctamente');

      this.limpiarFormulario();
    }
  }

  // =====================================================
  // LIMPIAR
  // =====================================================

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
