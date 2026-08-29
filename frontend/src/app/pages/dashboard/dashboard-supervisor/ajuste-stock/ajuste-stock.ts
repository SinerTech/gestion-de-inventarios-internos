import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';


@Component({
    imports: [ReactiveFormsModule],
    selector: 'app-ajuste-stock',
    styleUrl: './ajuste-stock.css',
    templateUrl: './ajuste-stock.html',
})

export class AjusteStock {
    formularioAjuste!: FormGroup
    constructor(private formBuilder: FormBuilder) {
        this.formularioAjuste = this.formBuilder.group({
            producto: ['', Validators.required],
            tipoAjuste: ['', Validators.required],
            motivo: ['', Validators.required],
            cantidad: ['', [Validators.required, Validators.min(1)]],
            supervisor: ['', Validators.required],
            observaciones: ['']
        });
    }
    aplicarAjuste(): void {
        if (this.formularioAjuste.invalid) {
            this.formularioAjuste.markAllAsTouched();
            return;
        }
        const movimiento = {
            ...this.formularioAjuste.value,
            tipoMovimiento: 'AJUSTE'
        };
        console.log(movimiento);
        this.formularioAjuste.reset();
    }
}