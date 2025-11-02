import { TestBed } from '@angular/core/testing';

import { RegistrationDataService } from './registration-data.service';

describe('RegistrationDataService', () => {
  let service: RegistrationDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegistrationDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
