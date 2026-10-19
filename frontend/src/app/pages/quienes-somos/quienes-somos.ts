import { Component, inject, OnInit } from '@angular/core';
import { ContenidoService } from '../../services/contenido/contenido-service';
import { IntegranteEquipo } from '../../models/contenido.models';

@Component({
  imports: [],
  selector: 'app-quienes-somos',
  styleUrl: './quienes-somos.css',
  templateUrl: './quienes-somos.html',
})
export class QuienesSomos {
  integrantes: IntegranteEquipo[] = [];
  private contenidoService = inject(ContenidoService);

  ngOnInit(): void {
    this.contenidoService.obtenerQuienesSomos().subscribe({
      next: (data) => {
        this.integrantes = data;
      },
      error: (err) => {
        console.error('Error al obtener los miembros:', err);
      },
    });
  }
}