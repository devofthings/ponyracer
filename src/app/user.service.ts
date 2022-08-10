import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';

import { UserModel } from './models/user.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  userEvents = new BehaviorSubject<UserModel | null>(null);

  constructor(private http: HttpClient) {
    this.retrieveUser();
  }

  register(login: string, password: string, birthYear: number): Observable<UserModel> {
    const body = { login, password, birthYear };
    return this.http.post<UserModel>(`${environment}/api/users`, body);
  }

  authenticate(credentials: { login: string; password: string }): Observable<UserModel> {
    const body = { ...credentials };
    return this.http
      .post<UserModel>(`${environment.baseUrl}/api/users/authentication`, body)
      .pipe(tap((user: UserModel) => this.storeLoggedInUser(user)));
  }

  storeLoggedInUser(user: UserModel): void {
    window.localStorage.setItem('rememberMe', JSON.stringify(user));
    this.userEvents.next(user);
  }

  retrieveUser(): void {
    const value = window.localStorage.getItem('rememberMe');
    if (value) {
      const user = JSON.parse(value) as UserModel;
      this.userEvents.next(user);
    }
  }

  logout(): void {
    this.userEvents.next(null);
    window.localStorage.removeItem('rememberMe');
  }
}
