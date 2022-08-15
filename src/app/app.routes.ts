import { Routes } from '@angular/router';
import { BetComponent } from './bet/bet.component';

import { HomeComponent } from './home/home.component';
import { LiveComponent } from './live/live.component';
import { LoginComponent } from './login/login.component';
import { RacesComponent } from './races/races.component';
import { RegisterComponent } from './register/register.component';

export const ROUTES: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'races',
    children: [
      { path: '', component: RacesComponent },
      { path: ':raceId', component: BetComponent },
      { path: ':raceId/live', component: LiveComponent }
    ]
  },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent }
];
