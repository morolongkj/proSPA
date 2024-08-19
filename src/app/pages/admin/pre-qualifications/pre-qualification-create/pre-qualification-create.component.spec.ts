import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreQualificationCreateComponent } from './pre-qualification-create.component';

describe('PreQualificationCreateComponent', () => {
  let component: PreQualificationCreateComponent;
  let fixture: ComponentFixture<PreQualificationCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreQualificationCreateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PreQualificationCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
