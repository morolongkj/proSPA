import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenderBoxListComponent } from './tender-box-list.component';

describe('TenderBoxListComponent', () => {
  let component: TenderBoxListComponent;
  let fixture: ComponentFixture<TenderBoxListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TenderBoxListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TenderBoxListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
