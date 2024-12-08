import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { documentListResolver } from './document-list.resolver';

describe('documentListResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => documentListResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
