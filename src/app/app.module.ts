import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { FromNowPipe } from './from-now.pipe';
import { MenuComponent } from './menu/menu.component';
import { PonyComponent } from './pony/pony.component';
import { RaceComponent } from './race/race.component';
import { RacesComponent } from './races/races.component';

@NgModule({
  declarations: [AppComponent, MenuComponent, RacesComponent, RaceComponent, PonyComponent, FromNowPipe],
  imports: [HttpClientModule, BrowserModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
