import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlStock } from './control-stock';

describe('ControlStock', () => {
  let component: ControlStock;
  let fixture: ComponentFixture<ControlStock>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControlStock],
    }).compileComponents();

    fixture = TestBed.createComponent(ControlStock);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
