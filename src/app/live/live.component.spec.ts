import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

import { LiveComponent } from './live.component';
import { RaceService } from '../race.service';
import { RaceModel } from '../models/race.model';
import { PonyComponent } from '../pony/pony.component';
import { FromNowPipe } from '../from-now.pipe';

describe('LiveComponent', () => {
  let raceService: jasmine.SpyObj<RaceService>;
  const race = {
    id: 1,
    name: 'Lyon',
    status: 'PENDING',
    ponies: [],
    startInstant: '2020-02-18T08:02:00Z'
  } as RaceModel;

  beforeEach(() => {
    raceService = jasmine.createSpyObj<RaceService>('RaceService', ['get', 'live']);
    const activatedRoute = { snapshot: { paramMap: convertToParamMap({ raceId: 1 }) } };
    TestBed.configureTestingModule({
      declarations: [LiveComponent, PonyComponent, FromNowPipe],
      providers: [
        { provide: RaceService, useValue: raceService },
        { provide: ActivatedRoute, useValue: activatedRoute }
      ]
    });
  });

  it('should display the title', () => {
    raceService.get.and.returnValue(of(race));
    raceService.live.and.returnValue(of([]));
    const fixture = TestBed.createComponent(LiveComponent);
    fixture.detectChanges();

    const element = fixture.nativeElement;
    const title = element.querySelector('h1');
    expect(title).withContext('The template should display an h1 element with the race name inside').not.toBeNull();
    expect(title.textContent).withContext('The template should display an h1 element with the race name inside').toContain('Lyon');
  });

  it('should subscribe to the live observable', () => {
    raceService.get.and.returnValue(of(race));
    raceService.live.and.returnValue(of([]));
    const fixture = TestBed.createComponent(LiveComponent);
    fixture.detectChanges();

    expect(raceService.live).toHaveBeenCalledWith(1);
    expect(fixture.componentInstance.poniesWithPosition)
      .withContext('poniesWithPosition should be initialized in the subscribe')
      .not.toBeNull();
    expect(fixture.componentInstance.positionSubscription).withContext('positionSubscription should store the subscription').not.toBeNull();
  });

  it('should unsubscribe on destruction', () => {
    raceService.get.and.returnValue(of(race));
    raceService.live.and.returnValue(of([]));
    const fixture = TestBed.createComponent(LiveComponent);
    fixture.detectChanges();

    spyOn(fixture.componentInstance.positionSubscription!, 'unsubscribe');

    fixture.componentInstance.ngOnDestroy();

    expect(fixture.componentInstance.positionSubscription?.unsubscribe).toHaveBeenCalled();
  });

  it('should display a div with a pony component per pony', () => {
    raceService.get.and.returnValue(of(race));
    raceService.live.and.returnValue(of([]));
    const fixture = TestBed.createComponent(LiveComponent);
    fixture.detectChanges();

    fixture.componentInstance.poniesWithPosition = [
      { id: 1, name: 'Sunny Sunday', color: 'BLUE', position: 10 },
      { id: 2, name: 'Awesome Fridge', color: 'Green', position: 40 }
    ];

    fixture.detectChanges();

    const element = fixture.nativeElement;
    const divWithPonies = element.querySelectorAll('div.pony-wrapper');
    expect(divWithPonies.length).withContext('You should display a `div` with a class `pony-wrapper` for each pony').toBe(2);

    const debugElement = fixture.debugElement;
    const ponyComponents = debugElement.queryAll(By.directive(PonyComponent));
    expect(ponyComponents).withContext('You should display a `PonyComponent` for each pony').not.toBeNull();
    expect(ponyComponents.length).withContext('You should display a `PonyComponent` for each pony').toBe(2);

    const sunnySunday = ponyComponents[0];
    expect(sunnySunday.componentInstance.isRunning).withContext('Each pony should be running (use the `isRunning` input)').toBeTruthy();

    const sunnySundayDiv = divWithPonies[0];
    expect(sunnySundayDiv.getAttribute('style'))
      .withContext('The `margin-left` style should match the position of the pony in percent minus 5')
      .toBe('margin-left: 5%;');
  });
});
