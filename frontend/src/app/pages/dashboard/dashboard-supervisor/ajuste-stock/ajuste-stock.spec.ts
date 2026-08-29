import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AjusteStock } from './ajuste-stock';

describe('AjusteStock', () => {
  let component: AjusteStock;
  let fixture: ComponentFixture<AjusteStock>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjusteStock],
    }).compileComponents();

    fixture = TestBed.createComponent(AjusteStock);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
