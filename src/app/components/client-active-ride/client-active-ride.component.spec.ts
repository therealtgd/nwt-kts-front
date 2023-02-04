import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientActiveRideComponent } from './client-active-ride.component';

describe('ClientActiveRideComponent', () => {
  let component: ClientActiveRideComponent;
  let fixture: ComponentFixture<ClientActiveRideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientActiveRideComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientActiveRideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
