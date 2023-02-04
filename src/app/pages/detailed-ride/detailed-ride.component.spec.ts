import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedRideComponent } from './detailed-ride.component';

describe('DetailedRideComponent', () => {
  let component: DetailedRideComponent;
  let fixture: ComponentFixture<DetailedRideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailedRideComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailedRideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
