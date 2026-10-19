import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth-service';
import { Rol } from '../../models/rol.models';
import { NuevoUsuario } from '../../models/usuario.models';

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-registro',
  styleUrl: './registro.css',
  templateUrl: './registro.html',
})
export class Registro implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  listaRoles: Rol[] = [];

  formularioRegistro: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    rol: ['', Validators.required],
    password: ['', Validators.required],
    confirmarPassword: ['', Validators.required],
  });

  ngOnInit(): void {
    this.authService.obtenerRoles().subscribe({
      next: (roles) => (this.listaRoles = roles),
      error: (err) => console.error('Error al cargar los roles:', err),
    });
  }

  registrarse(): void {
    if (this.formularioRegistro.invalid) {
      this.formularioRegistro.markAllAsTouched();
      return;
    }

    if (this.Password?.value !== this.ConfirmarPassword?.value) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    const nuevoUsuario: NuevoUsuario = {
      nombreUsuario: this.Nombre?.value,
      apellidoUsuario: this.Apellido?.value,
      idRol: Number(this.Rol?.value),
      emailUsuario: this.Email?.value,
      password: this.Password?.value,
    };

    this.authService.registro(nuevoUsuario).subscribe({
      next: () => {
        alert('Registro exitoso');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Error al registrar usuario:', error);
        const detalle =
          error.error?.password?.[0] ??
          error.error?.email_usuario?.[0] ??
          'No se pudo registrar el usuario.';
        alert(detalle);
      },
    });
  }
  
  get Nombre () {
    return this.formularioRegistro.get("nombre")
  }
  get Apellido () {
    return this.formularioRegistro.get("apellido")
  }

  get Email () {
    return this.formularioRegistro.get("email")
  }
  get Rol () {
    return this.formularioRegistro.get("rol")
  }
  get Password () {
    return this.formularioRegistro.get("password")
  }
  get ConfirmarPassword () {
    return this.formularioRegistro.get("confirmarPassword")
  }
}
