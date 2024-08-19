import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreQualificationListComponent } from './pre-qualification-list.component';

describe('PreQualificationListComponent', () => {
  let component: PreQualificationListComponent;
  let fixture: ComponentFixture<PreQualificationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreQualificationListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PreQualificationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
