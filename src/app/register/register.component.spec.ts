import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [RegisterComponent]
    })
  );

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
    const passwordCtrl = userForm.get('password')!;
    expect(passwordCtrl).withContext('Your form should have a `password` field').not.toBeNull();
    expect(passwordCtrl.getError('required')).withContext('The `password` field should be required').toBe(true);
    const birthYearCtrl = userForm.get('birthYear')!;
    expect(birthYearCtrl).withContext('Your form should have a `birthYear` field').not.toBeNull();
    birthYearCtrl.setValue(null);
    fixture.detectChanges();
    expect(birthYearCtrl.getError('required')).withContext('The `birthYear` field should be required').toBe(true);

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
    expect(userForm.value).toEqual({ login: 'Cédric', password: 'password', birthYear: 1986 });
    expect(loginCtrl.getError('required')).toBe(null);
    expect(passwordCtrl.getError('required')).toBe(null);
    expect(birthYearCtrl.getError('required')).toBe(null);
  });
});
