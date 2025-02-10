import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenderBoxDetailsComponent } from './tender-box-details.component';

describe('TenderBoxDetailsComponent', () => {
  let component: TenderBoxDetailsComponent;
  let fixture: ComponentFixture<TenderBoxDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TenderBoxDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TenderBoxDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
