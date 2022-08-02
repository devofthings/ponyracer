import { Component, Input } from '@angular/core';

import { RaceModel } from '../models/race.model';

@Component({
  selector: 'pr-race',
  templateUrl: './race.component.html',
  styleUrls: ['./race.component.css']
})
export class RaceComponent {
  @Input() raceModel!: RaceModel;
}
