import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { RouterLinkWithHref } from '@angular/router';
import { By } from '@angular/platform-browser';

import { MenuComponent } from './menu.component';

describe('MenuComponent', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [MenuComponent]
    })
  );

  it('should have a `navbarCollapsed` field', () => {
    const fixture = TestBed.createComponent(MenuComponent);
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
});
