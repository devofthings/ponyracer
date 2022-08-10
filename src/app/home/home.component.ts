import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserModel } from '../models/user.model';
import { UserService } from '../user.service';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  user: UserModel | null = null;
  userEventsSubscription: Subscription | null = null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userEventsSubscription = this.userService.userEvents.subscribe(newUser => {
      this.user = newUser;
    });
  }

  ngOnDestroy(): void {
    this.userEventsSubscription?.unsubscribe();
  }
}
