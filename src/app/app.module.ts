import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
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
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    RacesComponent,
    RaceComponent,
    PonyComponent,
    FromNowPipe,
    HomeComponent,
    RegisterComponent,
    LoginComponent
  ],
  imports: [BrowserModule, HttpClientModule, RouterModule.forRoot(ROUTES), ReactiveFormsModule, FormsModule],
  bootstrap: [AppComponent]
})
export class AppModule {}
