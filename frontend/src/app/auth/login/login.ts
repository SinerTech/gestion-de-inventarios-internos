import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth-service';

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  formularioLogin: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  ingresar(): void {
    if (this.formularioLogin.invalid) {
      this.formularioLogin.markAllAsTouched();
      return;
    }

    const { email, password } = this.formularioLogin.value;

    this.authService.login(email, password).subscribe({
      next: (usuario) => {
        this.router.navigateByUrl(this.authService.obtenerRutaDashboard(usuario));
      },
      error: (err) => {
        console.error('Error al intentar iniciar sesión:', err);
        if (err.status === 401 || err.status === 400) {
          alert('Credenciales incorrectas.');
        } else {
          alert('No se pudo establecer conexión con el servidor.');
        }
      },
    });
  }

  get Email() {
    return this.formularioLogin.get('email');
  }

  get Password() {
    return this.formularioLogin.get('password');
  }
}