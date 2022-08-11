import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { RaceService } from '../race.service';
import { RaceModel } from '../models/race.model';
import { PonyModel } from '../models/pony.model';

@Component({
  templateUrl: './bet.component.html',
  styleUrls: ['./bet.component.css']
})
export class BetComponent implements OnInit {
  raceModel: RaceModel | null = null;
  betFailed = false;

  constructor(private raceService: RaceService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const raceId = +this.route.snapshot.paramMap.get('raceId')!;
    this.raceService.get(raceId).subscribe(race => (this.raceModel = race));
  }

  betOnPony(pony: PonyModel): void {
    this.raceService.bet(this.raceModel!.id, pony.id).subscribe({
      next: race => (this.raceModel = race),
      error: () => (this.betFailed = true)
    });
  }

  isPonySelected(pony: PonyModel): boolean {
    return pony.id === this.raceModel!.betPonyId;
  }
}
