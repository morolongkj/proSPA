import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { tenderDetailsResolver } from './tender-details.resolver';

describe('tenderDetailsResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => tenderDetailsResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
