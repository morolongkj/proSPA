import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenTenderListComponent } from './open-tender-list.component';

describe('OpenTenderListComponent', () => {
  let component: OpenTenderListComponent;
  let fixture: ComponentFixture<OpenTenderListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpenTenderListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OpenTenderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
