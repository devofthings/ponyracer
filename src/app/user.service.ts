import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

import { environment } from '../environments/environment';
import { JwtInterceptor } from './jwt.interceptor';
import { UserModel } from './models/user.model';
import { WsService } from './ws.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  userEvents = new BehaviorSubject<UserModel | null>(null);

  constructor(private http: HttpClient, private jwtInterceptor: JwtInterceptor, private wsService: WsService) {
    this.retrieveUser();
  }

  register(login: string, password: string, birthYear: number): Observable<UserModel> {
    const body = { login, password, birthYear };
    return this.http.post<UserModel>(`${environment.baseUrl}/api/users`, body);
  }

  authenticate(credentials: { login: string; password: string }): Observable<UserModel> {
    return this.http
      .post<UserModel>(`${environment.baseUrl}/api/users/authentication`, credentials)
      .pipe(tap(user => this.storeLoggedInUser(user)));
  }

  storeLoggedInUser(user: UserModel): void {
    window.localStorage.setItem('rememberMe', JSON.stringify(user));
    this.jwtInterceptor.setJwtToken(user.token);
    this.userEvents.next(user);
  }

  retrieveUser(): void {
    const value = window.localStorage.getItem('rememberMe');
    if (value) {
      const user = JSON.parse(value) as UserModel;
      this.jwtInterceptor.setJwtToken(user.token);
      this.userEvents.next(user);
    }
  }

  logout(): void {
    window.localStorage.removeItem('rememberMe');
    this.jwtInterceptor.removeJwtToken();
    this.userEvents.next(null);
  }

  scoreUpdates(userId: number): Observable<UserModel> {
    return this.wsService.connect<UserModel>(`/player/${userId}`);
  }
}
