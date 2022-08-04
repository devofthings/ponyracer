import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { RacesComponent } from './races/races.component';
import { RaceComponent } from './race/race.component';
import { PonyComponent } from './pony/pony.component';
import { FromNowPipe } from './from-now.pipe';
import { RaceService } from './race.service';
import { RaceModel } from './models/race.model';

describe('AppComponent', () => {
  let raceService: jasmine.SpyObj<RaceService>;

  beforeEach(() => {
    raceService = jasmine.createSpyObj<RaceService>('RaceService', ['list']);
    TestBed.configureTestingModule({
      declarations: [AppComponent, MenuComponent, RacesComponent, RaceComponent, PonyComponent, FromNowPipe],
      providers: [{ provide: RaceService, useValue: raceService }]
    });
    raceService.list.and.returnValue(
      of([
        { name: 'Tokyo', startInstant: '2020-02-18T08:03:00Z' },
        { name: 'Paris', startInstant: '2020-02-18T08:04:00Z' }
      ] as Array<RaceModel>)
    );
  });

  it('should have a title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement;
    expect(element.querySelector('h1').textContent).withContext('You should have an `h1` with the text Ponyracer').toContain('Ponyracer');
  });

  it('should use the menu component', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const element = fixture.debugElement;
    expect(element.query(By.directive(MenuComponent)))
      .withContext('You probably forgot to add MenuComponent to the AppComponent template')
      .not.toBeNull();
  });

  it('should use the races component', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const element = fixture.debugElement;
    expect(element.query(By.directive(RacesComponent)))
      .withContext('You probably forgot to add RacesComponent to the AppComponent template')
      .not.toBeNull();
  });
});
