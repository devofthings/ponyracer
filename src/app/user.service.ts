import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, tap } from 'rxjs';

import { UserModel } from './models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  BASE_URL = 'https://ponyracer.ninja-squad.com/api';
  userEvents = new Subject<UserModel>();

  constructor(private http: HttpClient) {}

  register(login: string, password: string, birthYear: number): Observable<UserModel> {
    const body = { login, password, birthYear };
    return this.http.post<UserModel>(`${this.BASE_URL}/users`, body);
  }

  authenticate(credentials: { login: string; password: string }): Observable<UserModel> {
    const body = { ...credentials };
    return this.http
      .post<UserModel>(`${this.BASE_URL}/users/authentication`, body)
      .pipe(tap((user: UserModel) => this.userEvents.next(user)));
  }
}
