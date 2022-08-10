import { fakeAsync, tick, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';

import { LoginComponent } from './login.component';
import { UserService } from '../user.service';
import { UserModel } from '../models/user.model';

describe('LoginComponent', () => {
  let userService: jasmine.SpyObj<UserService>;

  beforeEach(() => {
    userService = jasmine.createSpyObj<UserService>('UserService', ['authenticate']);
    TestBed.configureTestingModule({
      imports: [FormsModule, RouterTestingModule],
      declarations: [LoginComponent],
      providers: [{ provide: UserService, useValue: userService }]
    });
  });

  it('should have a credentials field', () => {
    const fixture = TestBed.createComponent(LoginComponent);

    // when we trigger the change detection
    fixture.detectChanges();

    // then we should have a field credentials
    const componentInstance = fixture.componentInstance;
    expect(componentInstance.credentials)
      .withContext('Your component should have a field `credentials` initialized with an object')
      .not.toBeNull();
    expect(componentInstance.credentials.login)
      .withContext('The `login` field of `credentials` should be initialized with an empty string')
      .toBe('');
    expect(componentInstance.credentials.password)
      .withContext('The `password` field of `credentials` should be initialized with an empty string')
      .toBe('');
  });

  it('should have a title', () => {
    const fixture = TestBed.createComponent(LoginComponent);

    // when we trigger the change detection
    fixture.detectChanges();

    // then we should have a title
    const element = fixture.nativeElement;
    expect(element.querySelector('h1')).withContext('The template should have a `h1` tag').not.toBeNull();
    expect(element.querySelector('h1').textContent).withContext('The title should be `Log in`').toContain('Log in');
  });

  it('should have a disabled button if the form is incomplete', fakeAsync(() => {
    const fixture = TestBed.createComponent(LoginComponent);

    // when we trigger the change detection
    tick();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    // then we should have a disabled button
    const element = fixture.nativeElement;
    expect(element.querySelector('button')).withContext('The template should have a button').not.toBeNull();
    expect(element.querySelector('button').hasAttribute('disabled'))
      .withContext('The button should be disabled if the form is invalid')
      .toBe(true);
  }));

  it('should be possible to log in if the form is complete', fakeAsync(() => {
    const fixture = TestBed.createComponent(LoginComponent);

    fixture.detectChanges();
    tick();

    const element = fixture.nativeElement;
    const loginInput = element.querySelector('input[name="login"]');
    expect(loginInput).withContext('You should have an input with the name `login`').not.toBeNull();
    loginInput.value = 'login';
    loginInput.dispatchEvent(new Event('input'));
    const passwordInput = element.querySelector('input[name="password"]');
    expect(passwordInput).withContext('You should have an input with the name `password`').not.toBeNull();
    passwordInput.value = 'password';
    passwordInput.dispatchEvent(new Event('input'));

    // when we trigger the change detection
    fixture.detectChanges();

    // then we should have a submit button enabled
    expect(element.querySelector('button').hasAttribute('disabled'))
      .withContext('The button should be enabled if the form is valid')
      .toBe(false);
  }));

  it('should display error messages if fields are dirty and invalid', fakeAsync(() => {
    const fixture = TestBed.createComponent(LoginComponent);

    // when we trigger the change detection
    fixture.detectChanges();
    tick();

    // then we should have error fields
    const element = fixture.nativeElement;
    const loginInput = element.querySelector('input[name="login"]');
    expect(loginInput).withContext('You should have an input with the name `login`').not.toBeNull();
    loginInput.value = 'login';
    loginInput.dispatchEvent(new Event('input'));
    loginInput.value = '';
    loginInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    const loginError = element.querySelector('div.mb-3 div');
    expect(loginError).withContext('You should have an error message if the login field is required and dirty').not.toBeNull();
    expect(loginError.textContent).withContext('The error message for the login field is incorrect').toBe('Login is required');

    loginInput.value = 'login';
    loginInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const passwordInput = element.querySelector('input[name="password"]');
    expect(passwordInput).withContext('You should have an input with the name `password`').not.toBeNull();
    passwordInput.value = 'password';
    passwordInput.dispatchEvent(new Event('input'));
    passwordInput.value = '';
    passwordInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    const passwordError = element.querySelector('div.mb-3 div');
    expect(passwordError).withContext('You should have an error message if the password field is required and dirty').not.toBeNull();
    expect(passwordError.textContent).withContext('The error message for the password field is incorrect').toBe('Password is required');
  }));

  it('should call the user service and redirect if success', () => {
    const router = TestBed.inject(Router);
    spyOn(router, 'navigateByUrl');
    const fixture = TestBed.createComponent(LoginComponent);

    fixture.detectChanges();

    const subject = new Subject<UserModel>();
    userService.authenticate.and.returnValue(subject);

    const componentInstance = fixture.componentInstance;
    componentInstance.credentials.login = 'login';
    componentInstance.credentials.password = 'password';

    componentInstance.authenticate();

    // then we should have called the user service method
    expect(userService.authenticate).toHaveBeenCalledWith({
      login: 'login',
      password: 'password'
    });

    subject.next({} as UserModel);
    // and redirect to the home
    expect(componentInstance.authenticationFailed)
      .withContext('You should have a field `authenticationFailed` set to false if registration succeeded')
      .toBe(false);
    expect(router.navigateByUrl).toHaveBeenCalledWith('/');
  });

  it('should call the user service and display a message if failed', () => {
    const router = TestBed.inject(Router);
    spyOn(router, 'navigateByUrl');
    const fixture = TestBed.createComponent(LoginComponent);

    fixture.detectChanges();

    const subject = new Subject<UserModel>();
    userService.authenticate.and.returnValue(subject);

    const componentInstance = fixture.componentInstance;
    componentInstance.credentials.login = 'login';
    componentInstance.credentials.password = 'password';

    componentInstance.authenticate();

    // then we should have called the user service method
    expect(userService.authenticate).toHaveBeenCalledWith({
      login: 'login',
      password: 'password'
    });

    subject.error(new Error());
    // and not redirect to the home
    expect(router.navigateByUrl).not.toHaveBeenCalled();
    expect(componentInstance.authenticationFailed)
      .withContext('You should have a field `authenticationFailed` set to true if registration failed')
      .toBe(true);
  });

  it('should display a message if auth failed', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const componentInstance = fixture.componentInstance;
    componentInstance.authenticationFailed = true;

    fixture.detectChanges();

    const element = fixture.nativeElement;
    expect(element.querySelector('.alert'))
      .withContext('You should have a div with a class `alert` to display an error message')
      .not.toBeNull();
    expect(element.querySelector('.alert').textContent).toContain('Nope, try again');
  });
});
