import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryExportComponent } from './category-export.component';

describe('CategoryExportComponent', () => {
  let component: CategoryExportComponent;
  let fixture: ComponentFixture<CategoryExportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryExportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CategoryExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
