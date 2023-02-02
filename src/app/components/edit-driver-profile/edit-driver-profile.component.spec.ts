import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDriverProfileComponent } from './edit-driver-profile.component';

describe('EditDriverProfileComponent', () => {
  let component: EditDriverProfileComponent;
  let fixture: ComponentFixture<EditDriverProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditDriverProfileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditDriverProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
