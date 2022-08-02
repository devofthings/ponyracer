import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { RacesComponent } from './races/races.component';
import { RaceComponent } from './race/race.component';
import { PonyComponent } from './pony/pony.component';
import { FromNowPipe } from './from-now.pipe';

describe('AppComponent', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      declarations: [AppComponent, MenuComponent, RacesComponent, RaceComponent, PonyComponent, FromNowPipe]
    })
  );

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
