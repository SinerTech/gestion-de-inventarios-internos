import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InicioDashboardAdmin } from './inicio-dashboard-admin';

describe('InicioDashboardAdmin', () => {
  let component: InicioDashboardAdmin;
  let fixture: ComponentFixture<InicioDashboardAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InicioDashboardAdmin],
    }).compileComponents();

    fixture = TestBed.createComponent(InicioDashboardAdmin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
