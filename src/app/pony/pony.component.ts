import { Component, EventEmitter, Input, Output } from '@angular/core';

import { PonyModel } from '../models/pony.model';

@Component({
  selector: 'pr-pony',
  templateUrl: './pony.component.html',
  styleUrls: ['./pony.component.css']
})
export class PonyComponent {
  @Input() ponyModel!: PonyModel;
  @Input() isRunning = false;
  @Input() isBoosted: boolean | undefined = false;
  @Output() readonly ponyClicked = new EventEmitter<PonyModel>();

  getPonyImageUrl(): string {
    return this.isRunning
      ? this.isBoosted
        ? `assets/images/pony-${this.ponyModel.color.toLowerCase()}-rainbow.gif`
        : `assets/images/pony-${this.ponyModel.color.toLowerCase()}-running.gif`
      : `assets/images/pony-${this.ponyModel.color.toLowerCase()}.gif`;
  }

  clicked(): void {
    this.ponyClicked.emit(this.ponyModel);
  }
}
