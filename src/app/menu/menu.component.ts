import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, switchMap, concat, of, catchError, EMPTY } from 'rxjs';
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

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.userEventsSubscription = this.userService.userEvents
      .pipe(switchMap(user => (user ? concat(of(user), this.userService.scoreUpdates(user.id).pipe(catchError(() => EMPTY))) : of(null))))
      .subscribe(userWithScore => (this.user = userWithScore));
  }

  ngOnDestroy(): void {
    this.userEventsSubscription?.unsubscribe();
  }

  toggleNavbar(): void {
    this.navbarCollapsed = !this.navbarCollapsed;
  }

  logout(event: Event): void {
    event.preventDefault(); // Should be a button instead of an link with role button
    this.userService.logout();
    this.router.navigateByUrl('/');
  }
}
