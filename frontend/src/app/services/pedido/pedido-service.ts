import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

export interface DetalleVentaRequest {
  id_producto: number;
  cantidad: number;
  precio_unitario: number;
}

export interface RegistrarVentaRequest {
  id_cliente: number;
  id_usuario: number;
  fecha_hora_pedido: string;
  metodo_pago: string;
  observaciones: string;
  detalles: DetalleVentaRequest[];
}

export interface VentaRegistrada {
  id_pedido: number;
  id_cliente: number;
  id_usuario: number;
  fecha_hora_pedido: string;
  metodo_pago: string;
  observaciones: string;
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private url = 'http://127.0.0.1:8000/api/v1/Ventas/';
  private httpClient = inject(HttpClient);

  registrarVenta(
    venta: RegistrarVentaRequest
  ): Observable<VentaRegistrada> {
    return this.httpClient.post<VentaRegistrada>(
      this.url,
      venta
    ).pipe(
      catchError(this.handleError)
    );
  }

private handleError(error: HttpErrorResponse) {
  if (error.status === 0) {
    console.error('Error de conexión con Django:', error.error);
    return throwError(() => new Error(
      'No se pudo conectar con el servidor Django.'
    ));
  }

  console.error(`Django devolvió el código ${error.status}:`, error.error);

  const detalle = error.error?.detail;
  if (typeof detalle === 'string') {
    return throwError(() => new Error(detalle));
  }

  if (error.error && typeof error.error === 'object') {
    const mensajes = Object.entries(error.error)
      .map(([campo, valor]) => {
        const texto = Array.isArray(valor)
          ? valor.join(', ')
          : String(valor);
        return `${campo}: ${texto}`;
      })
      .join(' | ');

    if (mensajes) {
      return throwError(() => new Error(mensajes));
    }
  }

  return throwError(() => new Error(
    'No se pudo registrar la venta. Intente nuevamente.'
  ));
}
}