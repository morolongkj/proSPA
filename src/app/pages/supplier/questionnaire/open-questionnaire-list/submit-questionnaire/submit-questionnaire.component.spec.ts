import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitQuestionnaireComponent } from './submit-questionnaire.component';

describe('SubmitQuestionnaireComponent', () => {
  let component: SubmitQuestionnaireComponent;
  let fixture: ComponentFixture<SubmitQuestionnaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubmitQuestionnaireComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubmitQuestionnaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
