import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home {
  titulo = 'Gestión Inteligente de Inventarios';
  descripcion =
    'Optimiza el control de stock de tu empresa mediante una plataforma moderna, segura y eficiente. Centraliza tu inventario en tiempo real, automatiza las alertas de reposición y toma decisiones estratégicas basadas en datos precisos. La solución definitiva para reducir costos operativos, evitar quiebres de stock y potenciar el crecimiento de tu negocio.';
  valores = [
    {
      icono: 'bi-hourglass-split',
      titulo: 'Control en tiempo real',
      descripcion: 'Consulta y administra el inventario desde cualquier lugar.'
    },
    {
      icono: 'bi-key',
      titulo: 'Mayor seguridad',
      descripcion: 'Acceso protegido mediante usuarios y roles.'
    },
    {
      icono: 'bi-lightbulb',
      titulo: 'Gestión eficiente',
      descripcion: 'Reduce errores y optimiza la toma de decisiones.'
    }
  ];
}