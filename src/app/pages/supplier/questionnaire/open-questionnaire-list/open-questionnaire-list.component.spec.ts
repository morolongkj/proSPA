import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenQuestionnaireListComponent } from './open-questionnaire-list.component';

describe('OpenQuestionnaireListComponent', () => {
  let component: OpenQuestionnaireListComponent;
  let fixture: ComponentFixture<OpenQuestionnaireListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpenQuestionnaireListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OpenQuestionnaireListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
