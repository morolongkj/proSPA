import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionnaireDocumentsComponent } from './questionnaire-documents.component';

describe('QuestionnaireDocumentsComponent', () => {
  let component: QuestionnaireDocumentsComponent;
  let fixture: ComponentFixture<QuestionnaireDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionnaireDocumentsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QuestionnaireDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
