import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserModel } from '../models/user.model';
import { UserService } from '../user.service';

@Component({
  selector: 'pr-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit, OnDestroy {
  navbarCollapsed = true;
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

  toggleNavbar(): void {
    this.navbarCollapsed = !this.navbarCollapsed;
  }
}
