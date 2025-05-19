import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorStatsComponent } from './vendor-stats.component';

describe('VendorStatsComponent', () => {
  let component: VendorStatsComponent;
  let fixture: ComponentFixture<VendorStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendorStatsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VendorStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
