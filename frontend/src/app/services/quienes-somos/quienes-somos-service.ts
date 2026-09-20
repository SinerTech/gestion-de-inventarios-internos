import { HttpClient } from '@angular/common/http';
import { Service,inject } from '@angular/core';
import { Observable } from 'rxjs';

@Service()
export class QuienesSomosService {
  url = 'http://localhost:3000/quienes-somos';
  private httpClient = inject(HttpClient)
  

  obtenerMiembrosEquipo(): Observable<any> 
  {
    return this.httpClient.get(this.url);
  }
}
