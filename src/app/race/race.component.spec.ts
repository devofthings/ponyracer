import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { formatDistanceToNowStrict, parseISO } from 'date-fns';

import { RaceComponent } from './race.component';
import { PonyComponent } from '../pony/pony.component';
import { FromNowPipe } from '../from-now.pipe';

describe('RaceComponent', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      declarations: [RaceComponent, PonyComponent, FromNowPipe]
    })
  );

  it('should display a race name and its ponies', () => {
    const fixture = TestBed.createComponent(RaceComponent);

    // given a race in Paris with 5 ponies
    const raceComponent = fixture.componentInstance;
    raceComponent.raceModel = {
      id: 12,
      name: 'Paris',
      ponies: [
        { id: 1, name: 'Gentle Pie', color: 'YELLOW' },
        { id: 2, name: 'Big Soda', color: 'ORANGE' },
        { id: 3, name: 'Gentle Bottle', color: 'PURPLE' },
        { id: 4, name: 'Superb Whiskey', color: 'GREEN' },
        { id: 5, name: 'Fast Rainbow', color: 'BLUE' }
      ],
      startInstant: '2020-02-18T08:02:00Z'
    };

    // when triggering the change detection
    fixture.detectChanges();

    // then we should have the name and ponies displayed in the template
    const element = fixture.nativeElement;
    const raceName = element.querySelector('h2');
    expect(raceName).withContext('You need an h2 element for the race name').not.toBeNull();
    expect(raceName.textContent).withContext('The h2 element should contain the race name').toContain('Paris');
    const directives = fixture.debugElement.queryAll(By.directive(PonyComponent));
    expect(directives).withContext('You should use the PonyComponent in your template to display the ponies').not.toBeNull();
    expect(directives.length).withContext('You should have five pony components in your template').toBe(5);
    const startInstant = element.querySelector('p');
    expect(startInstant).withContext('You need an p element for the race start instant').not.toBeNull();
    expect(startInstant.textContent)
      .withContext('You should use the `fromNow` pipe you created to format the start instant')
      .toBe(formatDistanceToNowStrict(parseISO(raceComponent.raceModel.startInstant), { addSuffix: true }));
    const ponies = fixture.debugElement.queryAll(By.directive(PonyComponent));
    expect(ponies).withContext('You should use the PonyComponent in your template to display the ponies').not.toBeNull();
    expect(ponies.length).withContext('You should have five pony components in your template').toBe(5);
  });
});
