import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IngresoStock } from './ingreso-stock';

describe('IngresoStock', () => {
  let component: IngresoStock;
  let fixture: ComponentFixture<IngresoStock>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IngresoStock],
    }).compileComponents();

    fixture = TestBed.createComponent(IngresoStock);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
