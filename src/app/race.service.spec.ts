import { TestBed } from '@angular/core/testing';

import { RaceService } from './race.service';

describe('RaceService', () => {
  let raceService: RaceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    raceService = TestBed.inject(RaceService);
  });

  it('should list races', () => {
    const races = raceService.list();
    expect(races.length).withContext('The service should return two races for the `list()` method').toBe(2);
  });
});
