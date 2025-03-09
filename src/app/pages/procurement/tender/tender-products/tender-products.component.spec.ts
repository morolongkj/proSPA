import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenderProductsComponent } from './tender-products.component';

describe('TenderProductsComponent', () => {
  let component: TenderProductsComponent;
  let fixture: ComponentFixture<TenderProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TenderProductsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TenderProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
