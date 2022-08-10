import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject } from 'rxjs';

import { HomeComponent } from './home.component';
import { UserModel } from '../models/user.model';
import { UserService } from '../user.service';

describe('HomeComponent', () => {
  beforeEach(() => {
    const userService = { userEvents: new BehaviorSubject<UserModel | null>(null) } as UserService;
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [HomeComponent],
      providers: [{ provide: UserService, useValue: userService }]
    });
  });

  it('display the title and quote', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    const element = fixture.nativeElement;

    const title = element.querySelector('h1');
    expect(title).withContext('You should have an `h1` element to display the title').not.toBeNull();
    expect(title.textContent).toContain('Ponyracer');
    expect(title.textContent)
      .withContext('You should have the `small` element inside the `h1` element')
      .toContain('Always a pleasure to bet on ponies');

    const subtitle = element.querySelector('small');
    expect(subtitle).withContext('You should have a `small` element to display the subtitle').not.toBeNull();
    expect(subtitle.textContent).toContain('Always a pleasure to bet on ponies');
  });

  it('display a link to go the login and another to register', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    const element = fixture.nativeElement;
    fixture.detectChanges();

    fixture.componentInstance.user = null;
    fixture.detectChanges();

    const button = element.querySelector('a[href="/login"]');
    expect(button)
      .withContext('You should have an `a` element to display the link to the login. Maybe you forgot to use `routerLink`?')
      .not.toBeNull();
    expect(button.textContent).withContext('The link should have a text').toContain('Login');

    const buttonRegister = element.querySelector('a[href="/register"]');
    expect(buttonRegister)
      .withContext('You should have an `a` element to display the link to the register page. Maybe you forgot to use `routerLink`?')
      .not.toBeNull();
    expect(buttonRegister.textContent).withContext('The link should have a text').toContain('Register');
  });

  it('should listen to userEvents in ngOnInit', () => {
    const userService = TestBed.inject(UserService);
    const fixture = TestBed.createComponent(HomeComponent);
    fixture.componentInstance.ngOnInit();

    const user = { login: 'cedric', money: 200 } as UserModel;

    userService.userEvents.next(user);

    userService.userEvents.subscribe(() => {
      expect(fixture.componentInstance.user).withContext('Your component should listen to the `userEvents` observable').toBe(user);
    });
  });

  it('should unsubscribe on destroy', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    fixture.componentInstance.ngOnInit();
    spyOn(fixture.componentInstance.userEventsSubscription!, 'unsubscribe');
    fixture.componentInstance.ngOnDestroy();

    expect(fixture.componentInstance.userEventsSubscription!.unsubscribe).toHaveBeenCalled();
  });

  it('should display only a link to go the races page if logged in', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    fixture.detectChanges();

    fixture.componentInstance.user = { login: 'cedric' } as UserModel;
    fixture.detectChanges();

    const element = fixture.nativeElement;
    const button = element.querySelector('a[href="/races"]');
    expect(button).withContext('The link should lead to the races if the user is logged').not.toBeNull();
    expect(button.textContent).withContext('The first link should lead to the races if the user is logged').toContain('Races');
  });
});
