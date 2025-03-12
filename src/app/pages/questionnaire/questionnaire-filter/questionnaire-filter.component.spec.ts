import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionnaireFilterComponent } from './questionnaire-filter.component';

describe('QuestionnaireFilterComponent', () => {
  let component: QuestionnaireFilterComponent;
  let fixture: ComponentFixture<QuestionnaireFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionnaireFilterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QuestionnaireFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
