import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { ROUTES } from './app.routes';
import { FromNowPipe } from './from-now.pipe';
import { HomeComponent } from './home/home.component';
import { MenuComponent } from './menu/menu.component';
import { PonyComponent } from './pony/pony.component';
import { RaceComponent } from './race/race.component';
import { RacesComponent } from './races/races.component';

@NgModule({
  declarations: [AppComponent, MenuComponent, RacesComponent, RaceComponent, PonyComponent, FromNowPipe, HomeComponent],
  imports: [HttpClientModule, BrowserModule, RouterModule.forRoot(ROUTES)],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
