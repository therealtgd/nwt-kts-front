import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedParticipantsComponent } from './detailed-participants.component';

describe('DetailedParticipantsComponent', () => {
  let component: DetailedParticipantsComponent;
  let fixture: ComponentFixture<DetailedParticipantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailedParticipantsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailedParticipantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
