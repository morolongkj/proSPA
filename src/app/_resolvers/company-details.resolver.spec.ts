import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { companyDetailsResolver } from './company-details.resolver';

describe('companyDetailsResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => companyDetailsResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
