import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth-service';
import { Rol } from '../../models/rol.models';

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

  listaRoles: Rol[] = [];

  formularioLogin: FormGroup = this.fb.group({
    rol: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  ngOnInit(): void {
    this.authService.obtenerRoles().subscribe({
      next: (roles) => {
        this.listaRoles = roles;
      },
      error: (err) => {
        console.error('Error al cargar roles desde db.json:', err);
      },
    });
  }

  ingresar(): void {
    if (this.formularioLogin.invalid) {
      this.formularioLogin.markAllAsTouched();
      return;
    }

    const { email, password, rol } = this.formularioLogin.value;

    this.authService.login(email, password, rol).subscribe({
      next: (usuario) => {
        if (usuario) {
          localStorage.setItem('usuario_actual', JSON.stringify(usuario));
          this.router.navigate(['/sinertech/dashboard-supervisor']);
        } else {
          alert('Credenciales incorrectas o el rol seleccionado no coincide.');
        }
      },
      error: (err) => {
        console.error('Error al intentar iniciar sesión:', err);
        alert('No se pudo establecer conexión con el servidor.');
      },
    });
  }

  get Rol() {
    return this.formularioLogin.get('rol');
  }

  get Email() {
    return this.formularioLogin.get('email');
  }

  get Password() {
    return this.formularioLogin.get('password');
  }
}
