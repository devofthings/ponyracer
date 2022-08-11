import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { ROUTES } from './app.routes';
import { FromNowPipe } from './from-now.pipe';
import { HomeComponent } from './home/home.component';
import { JwtInterceptor } from './jwt.interceptor';
import { LoginComponent } from './login/login.component';
import { MenuComponent } from './menu/menu.component';
import { PonyComponent } from './pony/pony.component';
import { RaceComponent } from './race/race.component';
import { RacesComponent } from './races/races.component';
import { RegisterComponent } from './register/register.component';
import { BetComponent } from './bet/bet.component';

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
    LoginComponent,
    BetComponent
  ],
  imports: [BrowserModule, HttpClientModule, RouterModule.forRoot(ROUTES), ReactiveFormsModule, FormsModule],
  bootstrap: [AppComponent],
  providers: [{ provide: HTTP_INTERCEPTORS, useExisting: JwtInterceptor, multi: true }]
})
export class AppModule {}
