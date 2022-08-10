import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { RouterLinkWithHref } from '@angular/router';
import { By } from '@angular/platform-browser';
import { Subject } from 'rxjs';

import { MenuComponent } from './menu.component';
import { UserService } from '../user.service';
import { UserModel } from '../models/user.model';

describe('MenuComponent', () => {
  const userService = { userEvents: new Subject<UserModel>() } as UserService;

  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [MenuComponent],
      providers: [{ provide: UserService, useValue: userService }]
    })
  );

  it('should have a `navbarCollapsed` field', () => {
    const fixture = TestBed.createComponent(MenuComponent);
    fixture.componentInstance.ngOnInit();
    expect(fixture.componentInstance.navbarCollapsed)
      .withContext(
        'Check that `navbarCollapsed` is initialized with `true`. Maybe you forgot to declare `navbarCollapsed` in your component.'
      )
      .toBe(true);
  });

  it('should have a `toggleNavbar` method', () => {
    const fixture = TestBed.createComponent(MenuComponent);
    expect(fixture.componentInstance.toggleNavbar).withContext('Maybe you forgot to declare a `toggleNavbar()` method').not.toBeNull();

    fixture.componentInstance.toggleNavbar();

    expect(fixture.componentInstance.navbarCollapsed)
      .withContext('`toggleNavbar()` should change `navbarCollapsed` from `true` to `false`')
      .toBe(false);

    fixture.componentInstance.toggleNavbar();

    expect(fixture.componentInstance.navbarCollapsed)
      .withContext('`toggleNavbar()` should change `navbarCollapsed` from false to true`')
      .toBe(true);
  });

  it('should toggle the class on click', () => {
    const fixture = TestBed.createComponent(MenuComponent);
    const element = fixture.nativeElement;

    fixture.detectChanges();

    const navbarCollapsed = element.querySelector('#navbar');
    expect(navbarCollapsed).withContext('No element with the id `#navbar`').not.toBeNull();
    expect(navbarCollapsed.classList)
      .withContext('The element with the id `#navbar` should have the class `collapse`')
      .toContain('collapse');

    const button = element.querySelector('button');
    expect(button).withContext('No `button` element to collapse the menu').not.toBeNull();
    button.dispatchEvent(new Event('click'));

    fixture.detectChanges();

    const navbar = element.querySelector('#navbar');
    expect(navbar.classList)
      .withContext('The element with the id `#navbar` should have not the class `collapse` after a click')
      .not.toContain('collapse');
  });

  it('should use routerLink to navigate', () => {
    const fixture = TestBed.createComponent(MenuComponent);

    fixture.detectChanges();

    const links = fixture.debugElement.queryAll(By.directive(RouterLinkWithHref));
    expect(links.length).withContext('You should have two routerLink: one to the races, one to the home').toBe(2);
  });

  it('should listen to userEvents in ngOnInit', () => {
    const fixture = TestBed.createComponent(MenuComponent);
    fixture.componentInstance.ngOnInit();

    const user = { login: 'cedric', money: 200 } as UserModel;

    userService.userEvents.subscribe(() => {
      expect(fixture.componentInstance.user).withContext('Your component should listen to the `userEvents` observable').toBe(user);
    });

    userService.userEvents.next(user);
  });

  it('should display the user if logged', () => {
    const fixture = TestBed.createComponent(MenuComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance;
    component.user = { login: 'cedric', money: 200 } as UserModel;

    fixture.detectChanges();

    const element = fixture.nativeElement;
    const info = element.querySelector('#current-user');
    expect(info).withContext('You should have a `span` element with the ID `current-user` to display the user info').not.toBeNull();
    expect(info.textContent).withContext('You should display the name of the user in a `span` element').toContain('cedric');
    expect(info.textContent).withContext('You should display the score of the user in a `span` element').toContain('200');
  });

  it('should unsubscribe on destroy', () => {
    const fixture = TestBed.createComponent(MenuComponent);
    fixture.componentInstance.ngOnInit();
    spyOn(fixture.componentInstance.userEventsSubscription!, 'unsubscribe');
    fixture.componentInstance.ngOnDestroy();

    expect(fixture.componentInstance.userEventsSubscription!.unsubscribe).toHaveBeenCalled();
  });
});
