import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { userDetailsResolver } from './user-details.resolver';

describe('userDetailsResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => userDetailsResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
