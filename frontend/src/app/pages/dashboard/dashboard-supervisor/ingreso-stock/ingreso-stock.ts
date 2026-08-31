import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-ingreso-stock',
  styleUrl: './ingreso-stock.css',
  templateUrl: './ingreso-stock.html',
})
export class IngresoStock {
  formularioIngreso!: FormGroup
    constructor(private formBuilder: FormBuilder) {
        this.formularioIngreso = this.formBuilder.group({
            producto: ['', Validators.required],
            cantidad: ['', [Validators.required, Validators.min(1)]],
            proveedor: ['', Validators.required],
            supervisor: ['', Validators.required],
            loteFactura: ['', Validators.required],
            motivo: ['', Validators.required],
            observaciones: ['']
        });
    }
    registrarIngreso(): void {
        if (this.formularioIngreso.invalid) {
            this.formularioIngreso.markAllAsTouched();
            return;
        }
        const movimiento = {
            ...this.formularioIngreso.value,
            tipoMovimiento: 'INGRESO'
        };
        console.log(movimiento);
        this.formularioIngreso.reset();
    }
}