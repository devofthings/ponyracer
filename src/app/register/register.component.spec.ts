import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';

import { RegisterComponent } from './register.component';
import { UserService } from '../user.service';
import { UserModel } from '../models/user.model';

describe('RegisterComponent', () => {
  let userService: jasmine.SpyObj<UserService>;

  beforeEach(() => {
    userService = jasmine.createSpyObj<UserService>('UserService', ['register']);
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule],
      declarations: [RegisterComponent],
      providers: [{ provide: UserService, useValue: userService }]
    });
  });

  it('should call the register method on submit', () => {
    const fixture = TestBed.createComponent(RegisterComponent);
    spyOn(fixture.componentInstance, 'register');

    fixture.detectChanges();
    fixture.debugElement.query(By.css('form')).triggerEventHandler('ngSubmit', {});

    expect(fixture.componentInstance.register).toHaveBeenCalled();
    expect((fixture.componentInstance.register as jasmine.Spy).calls.count())
      .withContext('Looks like you are calling register several times!')
      .toBe(1);
  });

  it('should display a form to register', () => {
    const fixture = TestBed.createComponent(RegisterComponent);
    fixture.detectChanges();

    // given a form
    const userForm = fixture.componentInstance.userForm;

    expect(userForm.valid).toBe(false);
    const loginCtrl = userForm.get('login')!;
    expect(loginCtrl).withContext('Your form should have a `login` field').not.toBeNull();
    expect(loginCtrl.getError('required')).withContext('The `login` field should be required').toBe(true);
    const birthYearCtrl = userForm.get('birthYear')!;
    expect(birthYearCtrl).withContext('Your form should have a `birthYear` field').not.toBeNull();
    birthYearCtrl.setValue(null);
    fixture.detectChanges();
    expect(birthYearCtrl.getError('required')).withContext('The `birthYear` field should be required').toBe(true);
    const passwordGroup = fixture.componentInstance.passwordGroup;
    expect(passwordGroup).withContext('Your component should have a field `passwordGroup`').not.toBeNull();
    expect(passwordGroup.valid).toBe(false);
    const passwordCtrl = passwordGroup.get('password')!;
    expect(passwordCtrl).withContext('Your password group should have a `password` field').not.toBeNull();
    expect(passwordCtrl.getError('required')).withContext('The `password` field should be required').toBe(true);
    const confirmPasswordCtrl = passwordGroup.get('confirmPassword')!;
    expect(confirmPasswordCtrl).withContext('Your password group should have a `confirmPassword` field').not.toBeNull();
    expect(confirmPasswordCtrl.getError('required')).toBe(true);

    fixture.detectChanges();

    // when adding invalid values in the form
    const nativeElement = fixture.nativeElement;
    const button = nativeElement.querySelector('button');
    expect(button.getAttribute('disabled')).withContext('Your submit button should be disabled if the form is invalid').not.toBeNull();
    const login = nativeElement.querySelector('input');
    expect(login).withContext('Your template should have an input for the login').not.toBeNull();
    login.value = 'Cédric';
    login.dispatchEvent(new Event('input'));
    login.value = '';
    login.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const loginError = nativeElement.querySelector('div.mb-3 div');
    expect(loginError).withContext('You should have an error message if the login field is required and dirty').not.toBeNull();
    expect(loginError.textContent).withContext('The error message for the login field is incorrect').toBe('Login is required');

    login.value = 'Cédric';
    login.dispatchEvent(new Event('input'));

    const password = nativeElement.querySelector('[type="password"]');
    expect(password).withContext('Your template should have a password input for the password').not.toBeNull();
    password.value = 'password';
    password.dispatchEvent(new Event('input'));
    password.value = '';
    password.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const passwordError = nativeElement.querySelector('div.mb-3 div');
    expect(passwordError).withContext('You should have an error message if the password field is required and dirty').not.toBeNull();
    expect(passwordError.textContent).withContext('The error message for the password field is incorrect').toBe('Password is required');

    password.value = 'password';
    password.dispatchEvent(new Event('input'));

    const confirmPassword = nativeElement.querySelectorAll('[type="password"]')[1];
    expect(confirmPassword).withContext('Your template should have a password input for the confirm password').not.toBeNull();
    confirmPassword.value = 'password';
    confirmPassword.dispatchEvent(new Event('input'));
    confirmPassword.value = '';
    confirmPassword.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const confirmPasswordError = nativeElement.querySelector('div.mb-3 div');
    expect(confirmPasswordError)
      .withContext('You should have an error message if the confirm password field is required and dirty')
      .not.toBeNull();
    expect(confirmPasswordError.textContent)
      .withContext('The error message for the confirm password field is incorrect')
      .toContain('Confirming password is required');

    confirmPassword.value = 'password';
    confirmPassword.dispatchEvent(new Event('input'));

    const birthYear = nativeElement.querySelector('[type="number"]');
    expect(birthYear).withContext('Your template should have a number input for the birthYear').not.toBeNull();
    birthYear.value = 1986;
    birthYear.dispatchEvent(new Event('input'));
    birthYear.value = '';
    birthYear.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const birthYearError = nativeElement.querySelector('div.mb-3 div');
    expect(birthYearError).withContext('You should have an error message if the birthYear field is required and dirty').not.toBeNull();
    expect(birthYearError.textContent).withContext('The error message for the birthYear field is incorrect').toBe('Birth year is required');

    // when adding correct values in the form
    birthYear.value = 1986;
    birthYear.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    // then we should have a valid form, with no error
    expect(userForm.valid).toBe(true);
    expect(button.getAttribute('disabled')).withContext('Your submit button should not be disabled if the form is invalid').toBeNull();
    expect(userForm.value).toEqual({
      login: 'Cédric',
      passwordForm: { password: 'password', confirmPassword: 'password' },
      birthYear: 1986
    });
    expect(loginCtrl.getError('required')).toBe(null);
    expect(passwordCtrl.getError('required')).toBe(null);
    expect(confirmPasswordCtrl.getError('required')).toBe(null);
    expect(birthYearCtrl.getError('required')).toBe(null);
  });

  it('should expect a login with 3 characters', () => {
    const fixture = TestBed.createComponent(RegisterComponent);
    fixture.detectChanges();

    // given a form
    const userForm = fixture.componentInstance.userForm;
    expect(userForm.valid).toBe(false);
    const loginCtrl = userForm.get('login')!;
    expect(loginCtrl.getError('required')).toBe(true);
    expect(loginCtrl.getError('minlength')).toBeUndefined();

    fixture.detectChanges();

    // when adding a too short login
    const nativeElement = fixture.nativeElement;
    const login = nativeElement.querySelector('input');
    login.value = 'Cé';
    login.dispatchEvent(new Event('input'));

    // then the form should still be invalid
    expect(userForm.valid).toBe(false);
    expect(loginCtrl.getError('minlength')).withContext('Your login field should have a minLength validator').not.toBeUndefined();
    expect(loginCtrl.getError('minlength').requiredLength)
      .withContext('Your login field should have a minLength validator of 3 characters')
      .toBe(3);

    // when adding a long enough login
    login.value = 'Cédric';
    login.dispatchEvent(new Event('input'));

    // then we should have a valid form, with no error
    expect(userForm.valid).toBe(false);
    expect(loginCtrl.getError('minlength')).toBe(null);
  });

  it('should have a custom validator to check the password match', () => {
    // given a FormGroup
    const passwordGroupNoMatch = new FormGroup({
      password: new FormControl('hello'),
      confirmPassword: new FormControl('hi')
    });

    // when validating the form
    const match = RegisterComponent.passwordMatch(passwordGroupNoMatch)!;

    // then we should have an error
    expect(match)
      .withContext('Your `passwordMatch` validator should return a `matchingError` if the passwords do not match')
      .toEqual({ matchingError: true });

    // when the passwords match
    const passwordGroup = new FormGroup({
      password: new FormControl('hello'),
      confirmPassword: new FormControl('hello')
    });
    const matchNoError = RegisterComponent.passwordMatch(passwordGroup);

    // then we should have no error
    expect(matchNoError).withContext('Your `passwordMatch` validator should return `null` if the passwords match').toBe(null);
  });

  it('should have a password confirmation', () => {
    const fixture = TestBed.createComponent(RegisterComponent);
    fixture.detectChanges();

    // given a form
    const passwordGroup = fixture.componentInstance.passwordGroup;
    expect(passwordGroup.valid).toBe(false);
    const passwordCtrl = passwordGroup.get('password')!;
    expect(passwordCtrl.getError('required')).toBe(true);
    const confirmPasswordCtrl = passwordGroup.get('confirmPassword')!;
    expect(confirmPasswordCtrl.getError('required')).toBe(true);
    expect(passwordGroup.getError('matchingError')).toBe(null);

    fixture.detectChanges();

    // when adding a password without confirmation
    const nativeElement = fixture.nativeElement;
    const password = nativeElement.querySelector('[type="password"]');
    password.value = 'password';
    password.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    // then the form should still be invalid
    expect(passwordGroup.valid).toBe(false);
    expect(passwordCtrl.getError('required')).toBe(null);
    expect(confirmPasswordCtrl.getError('required')).toBe(true);
    expect(passwordGroup.getError('matchingError')).toBe(true);
    // and displaying the message
    const matchingErrorMessage = nativeElement.querySelector('#password-matching-error');
    expect(matchingErrorMessage)
      .withContext('You should have a div with the id `password-matching-error` to display the error')
      .not.toBeNull();
    expect(matchingErrorMessage.textContent).withContext('Your error message is not correct').toContain('Your password does not match');

    // when adding a matching password
    const confirmPassword = nativeElement.querySelectorAll('[type="password"]')[1];
    confirmPassword.value = 'password';
    confirmPassword.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    // then we should have a valid form, with no error
    expect(passwordGroup.valid).toBe(true);
    expect(passwordCtrl.getError('required')).toBe(null);
    expect(confirmPasswordCtrl.getError('required')).toBe(null);
    // message no longer displayed
    const noMatchingErrorMessage = nativeElement.querySelector('#password-matching-error');
    expect(noMatchingErrorMessage).withContext('Your error message should disappear when there is no error').toBe(null);
  });

  it('should have min/max validators to check the year validity', () => {
    const fixture = TestBed.createComponent(RegisterComponent);
    fixture.detectChanges();

    const componentInstance = fixture.componentInstance;
    const birthYearCtrl = componentInstance.birthYearCtrl;
    const nativeElement = fixture.nativeElement;
    const birthYear = nativeElement.querySelector('[type="number"]');

    // given an invalid value in the past
    birthYear.value = 1899;
    birthYear.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    // then we should have an error
    expect(birthYearCtrl.hasError('min')).withContext('`birthYearCtrl` should have a `min` validator set to 1900').toBe(true);
    let invalidYearError = nativeElement.querySelector('#invalid-year-error');
    expect(invalidYearError)
      .withContext('A div with the id `invalid-year-error` must be displayed if the year is before 1900')
      .not.toBeNull();
    expect(invalidYearError.textContent).toContain('This is not a valid year');

    // given an invalid value in the future
    birthYear.value = new Date().getFullYear() + 1;
    birthYear.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    // then we should have an error
    expect(birthYearCtrl.hasError('max')).withContext('`birthYearCtrl` should have a `max` validator set to the next year').toBe(true);
    invalidYearError = nativeElement.querySelector('#invalid-year-error');
    expect(invalidYearError)
      .withContext('A div with the id `invalid-year-error` must be displayed if the year is after next year')
      .not.toBeNull();
    expect(invalidYearError.textContent).toContain('This is not a valid year');

    // given an valid value
    birthYear.value = 1982;
    birthYear.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    // then we should have no error
    expect(birthYearCtrl.hasError('min')).withContext('`birthYearCtrl` should have a `min` validator set to 1900').toBe(false);
    invalidYearError = nativeElement.querySelector('#invalid-year-error');
    expect(birthYearCtrl.hasError('max')).withContext('`birthYearCtrl` should have a `max` validator set to the next year').toBe(false);
    expect(invalidYearError).withContext('A div with the id `invalid-year-error` must not be displayed if the year is valid').toBeNull();
  });

  it('should call the user service to register', () => {
    const router = TestBed.inject(Router);
    spyOn(router, 'navigateByUrl');
    const fixture = TestBed.createComponent(RegisterComponent);
    fixture.detectChanges();

    // given a form completed
    userService.register.and.returnValue(of({ id: 1 } as UserModel));
    const component = fixture.componentInstance;
    component.loginCtrl.setValue('Cédric');
    component.passwordCtrl.setValue('password');
    component.birthYearCtrl.setValue(1986);

    // when registering
    component.register();

    // then we should have called the user service
    expect(userService.register).toHaveBeenCalledWith('Cédric', 'password', 1986);
    expect(router.navigateByUrl).toHaveBeenCalledWith('/');
  });

  it('should display an error message if registration fails', () => {
    const router = TestBed.inject(Router);
    spyOn(router, 'navigateByUrl');
    const fixture = TestBed.createComponent(RegisterComponent);
    fixture.detectChanges();

    // given a form completed
    userService.register.and.callFake(() => throwError(() => new Error('Oops')));
    const component = fixture.componentInstance;
    component.loginCtrl.setValue('Cédric');
    component.passwordCtrl.setValue('password');
    component.birthYearCtrl.setValue(1986);

    // when registering
    component.register();
    fixture.detectChanges();

    // then we should have called the user service
    expect(userService.register).toHaveBeenCalledWith('Cédric', 'password', 1986);
    // and not navigate
    expect(router.navigateByUrl).not.toHaveBeenCalled();
    expect(component.registrationFailed)
      .withContext('You should set a field `registrationFailed` to `true` if the registration fails')
      .toBe(true);
    // and display the error message
    const errorMessage = fixture.nativeElement.querySelector('#registration-error');
    expect(errorMessage)
      .withContext('You should display an error message in a div with id `registration-error` if the registration fails')
      .not.toBeNull();
    expect(errorMessage.textContent).toContain('Try again with another login.');
  });
});
