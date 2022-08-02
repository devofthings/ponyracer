import { Component, OnInit } from '@angular/core';

import { RaceModel } from '../models/race.model';
import { RaceService } from '../race.service';

@Component({
  selector: 'pr-races',
  templateUrl: './races.component.html',
  styleUrls: ['./races.component.css'],
  providers: [RaceService]
})
export class RacesComponent implements OnInit {
  races: Array<RaceModel> = [];

  constructor(private raceService: RaceService) {}

  ngOnInit(): void {
    this.races = this.raceService.list();
  }
}
