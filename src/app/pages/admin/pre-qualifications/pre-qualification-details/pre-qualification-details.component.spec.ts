import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreQualificationDetailsComponent } from './pre-qualification-details.component';

describe('PreQualificationDetailsComponent', () => {
  let component: PreQualificationDetailsComponent;
  let fixture: ComponentFixture<PreQualificationDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreQualificationDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PreQualificationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
