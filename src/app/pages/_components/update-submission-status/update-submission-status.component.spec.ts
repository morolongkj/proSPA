import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateSubmissionStatusComponent } from './update-submission-status.component';

describe('UpdateSubmissionStatusComponent', () => {
  let component: UpdateSubmissionStatusComponent;
  let fixture: ComponentFixture<UpdateSubmissionStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateSubmissionStatusComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateSubmissionStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
