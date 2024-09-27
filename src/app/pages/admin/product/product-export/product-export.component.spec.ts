import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductExportComponent } from './product-export.component';

describe('ProductExportComponent', () => {
  let component: ProductExportComponent;
  let fixture: ComponentFixture<ProductExportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductExportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
