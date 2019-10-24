import { TestBed } from '@angular/core/testing';

import { OrganisationUnitService } from './organisation-unit.service';
import { HttpClientModule } from '@angular/common/http';

describe('OrganisationUnitService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientModule]
    })
  );

  it('should be created', () => {
    const service: OrganisationUnitService = TestBed.get(
      OrganisationUnitService
    );
    expect(service).toBeTruthy();
  });
});
