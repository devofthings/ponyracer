import { HomeComponent } from './home/home.component';
import { RacesComponent } from './races/races.component';

export const ROUTES = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'races',
    component: RacesComponent
  }
];
