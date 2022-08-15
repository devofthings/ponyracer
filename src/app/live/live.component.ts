import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { PonyWithPositionModel } from '../models/pony.model';
import { RaceModel } from '../models/race.model';
import { RaceService } from '../race.service';

@Component({
  selector: 'pr-live',
  templateUrl: './live.component.html',
  styleUrls: ['./live.component.css']
})
export class LiveComponent implements OnInit, OnDestroy {
  raceModel: RaceModel | null = null;
  poniesWithPosition: Array<PonyWithPositionModel> = [];
  positionSubscription: Subscription | null = null;

  constructor(private raceService: RaceService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const raceId = +this.route.snapshot.paramMap.get('raceId')!;
    this.raceService.get(raceId).subscribe(race => (this.raceModel = race));
    this.positionSubscription = this.raceService.live(raceId).subscribe(positions => {
      this.poniesWithPosition = positions;
    });
  }

  ngOnDestroy(): void {
    this.positionSubscription?.unsubscribe();
  }
}
