import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RaceModel } from './models/race.model';

@Injectable({
  providedIn: 'root'
})
export class RaceService {
  constructor(private http: HttpClient) {}
  BASE_URL = 'https://ponyracer.ninja-squad.com';
  list = (): Observable<Array<RaceModel>> => {
    const params = { status: 'PENDING' };
    return this.http.get<Array<RaceModel>>(`${this.BASE_URL}/api/races`, { params });
  };
}
