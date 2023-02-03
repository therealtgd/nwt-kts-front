import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedReviewsComponent } from './detailed-reviews.component';

describe('DetailedReviewsComponent', () => {
  let component: DetailedReviewsComponent;
  let fixture: ComponentFixture<DetailedReviewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailedReviewsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailedReviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
