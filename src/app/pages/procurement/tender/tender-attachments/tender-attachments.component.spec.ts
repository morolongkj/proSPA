import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenderAttachmentsComponent } from './tender-attachments.component';

describe('TenderAttachmentsComponent', () => {
  let component: TenderAttachmentsComponent;
  let fixture: ComponentFixture<TenderAttachmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TenderAttachmentsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TenderAttachmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
