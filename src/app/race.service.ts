import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { RaceModel } from './models/race.model';

@Injectable({
  providedIn: 'root'
})
export class RaceService {
  constructor(private http: HttpClient) {}
  list = (): Observable<Array<RaceModel>> => {
    const params = { status: 'PENDING' };
    return this.http.get<Array<RaceModel>>(`${environment.baseUrl}/api/races`, { params });
  };

  get(id: number): Observable<RaceModel> {
    return this.http.get<RaceModel>(`${environment.baseUrl}/api/races/${id}`);
  }

  bet(raceId: number, ponyId: number): Observable<RaceModel> {
    const body = { ponyId };
    return this.http.post<RaceModel>(`${environment.baseUrl}/api/races/${raceId}/bets`, body);
  }

  cancelBet(raceId: number): Observable<void> {
    return this.http.delete<void>(`${environment.baseUrl}/api/races/${raceId}/bets`);
  }
}
