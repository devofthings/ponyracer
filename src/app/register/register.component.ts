import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'pr-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  userForm: FormGroup<{
    login: FormControl<string | null>;
    password: FormControl<string | null>;
    birthYear: FormControl<number | null>;
  }>;

  constructor(fb: FormBuilder) {
    this.userForm = fb.group({
      login: fb.control('', Validators.required),
      password: fb.control('', Validators.required),
      birthYear: fb.control(0, Validators.required)
    });
  }

  register() {}
}
