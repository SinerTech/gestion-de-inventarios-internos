import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResumenVenta } from './resumen-venta';

describe('ResumenVenta', () => {
  let component: ResumenVenta;
  let fixture: ComponentFixture<ResumenVenta>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResumenVenta],
    }).compileComponents();

    fixture = TestBed.createComponent(ResumenVenta);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
