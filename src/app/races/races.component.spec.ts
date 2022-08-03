import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

import { RacesComponent } from './races.component';
import { RaceComponent } from '../race/race.component';
import { PonyComponent } from '../pony/pony.component';
import { FromNowPipe } from '../from-now.pipe';
import { RaceService } from '../race.service';
import { RaceModel } from '../models/race.model';

describe('RacesComponent', () => {
  let raceService: jasmine.SpyObj<RaceService>;

  beforeEach(() => {
    raceService = jasmine.createSpyObj<RaceService>('RaceService', ['list']);
    TestBed.configureTestingModule({
      declarations: [RacesComponent, RaceComponent, PonyComponent, FromNowPipe],
      providers: [{ provide: RaceService, useValue: raceService }]
    });
    raceService.list.and.returnValue(
      of([
        { name: 'Tokyo', startInstant: '2020-02-18T08:03:00Z' },
        { name: 'Paris', startInstant: '2020-02-18T08:04:00Z' }
      ] as Array<RaceModel>)
    );
  });

  it('should display every race', () => {
    const fixture = TestBed.createComponent(RacesComponent);
    fixture.detectChanges();
    const debugElement = fixture.debugElement;
    const races = debugElement.queryAll(By.directive(RaceComponent));
    expect(races.length).withContext('You should have two `RaceComponent` displayed').toBe(2);
  });
});
