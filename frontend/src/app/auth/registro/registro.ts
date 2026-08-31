import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-registro',
  styleUrl: './registro.css',
  templateUrl: './registro.html',
})
export class Registro {
  formularioRegistro!: FormGroup;

  constructor(private formRegistro: FormBuilder, private router: Router) {

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
      alert("Enviar solicitud de registro al servidor");
      this.router.navigate(['/login']);
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
