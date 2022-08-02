import { Component, OnInit } from '@angular/core';

import { RaceModel } from '../models/race.model';

@Component({
  selector: 'pr-races',
  templateUrl: './races.component.html',
  styleUrls: ['./races.component.css']
})
export class RacesComponent implements OnInit {
  races: Array<RaceModel> = [];

  ngOnInit(): void {
    this.races = [{ name: 'Lyon' }, { name: 'London' }];
  }
}
