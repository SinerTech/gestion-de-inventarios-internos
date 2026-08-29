import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  formularioLogin!: FormGroup;
  constructor(private formLogin: FormBuilder, private router: Router) {
    this.formularioLogin = this.formLogin.group({
      rol: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }
  ingresar(): void {
    if (this.formularioLogin.valid) {
      alert("Enviar al Servidor");
      this.router.navigate(['/sinertech/dashboard-supervisor']);
    } else {
      this.formularioLogin.markAllAsTouched();
      return;
    }
    console.log(this.formularioLogin.value);
  }
  get Rol () {
    return this.formularioLogin.get("rol")
  }
  get Password () {
    return this.formularioLogin.get("password")
  }
  get Email () {
    return this.formularioLogin.get("email")
  }
}
