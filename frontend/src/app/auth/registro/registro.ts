import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth-service';

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-registro',
  styleUrl: './registro.css',
  templateUrl: './registro.html',
})
export class Registro {
  formularioRegistro!: FormGroup;

  constructor(
   private formRegistro: FormBuilder,
   private router: Router,
   private authService: AuthService
  ) {

    this.formularioRegistro = this.formRegistro.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      rol: ['', Validators.required],
      password: ['', Validators.required],
      confirmarPassword: ['', Validators.required]
    });

  }
  registrarse(): void {
  if (this.formularioRegistro.valid) {
    if (this.Password?.value !== this.ConfirmarPassword?.value) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    const nuevoUsuario = {
      nombreUsuario: this.Nombre?.value,
      idRol: this.Rol?.value,
      emailUsuario: this.Email?.value,
      password: this.Password?.value
    };

    this.authService.registro(nuevoUsuario).subscribe({
      next: () => {
        alert("Registro exitoso");
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error("Error al registrar usuario:", error);
        alert("No se pudo registrar el usuario.");
      }
    });

  } else {
    this.formularioRegistro.markAllAsTouched();
    return;
  }

  console.log(this.formularioRegistro.value);
}
  
  get Nombre () {
    return this.formularioRegistro.get("nombre")
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
