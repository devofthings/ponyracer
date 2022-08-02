import { Component } from '@angular/core';

@Component({
  selector: 'pr-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {
  navbarCollapsed = true;

  toggleNavbar(): void {
    this.navbarCollapsed = !this.navbarCollapsed;
  }
}
