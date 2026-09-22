import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { QuienesSomosService } from '../../services/quienes-somos/quienes-somos-service';

@Component({
  imports: [],
  selector: 'app-quienes-somos',
  styleUrl: './quienes-somos.css',
  templateUrl: './quienes-somos.html',
})
export class QuienesSomos {
  integrantes: any;
  private QuienesSomosService = inject(QuienesSomosService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.QuienesSomosService.obtenerMiembrosEquipo().subscribe({
      next: (data) => {
        this.integrantes = data;
        this.cdr.markForCheck()
      },
      error: (err) => {
        console.error('Error al obtener los miembros:', err);
      }
    });
  }
 
}