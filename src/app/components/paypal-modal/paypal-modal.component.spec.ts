import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaypalModalComponent } from './paypal-modal.component';

describe('PaypalModalComponent', () => {
  let component: PaypalModalComponent;
  let fixture: ComponentFixture<PaypalModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaypalModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaypalModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
