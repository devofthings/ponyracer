import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { interval, take, map, Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { PonyWithPositionModel } from './models/pony.model';
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

  live(raceId: number): Observable<Array<PonyWithPositionModel>> {
    const positions = interval(1000).pipe(take(101));
    return positions.pipe(
      map(position => [
        {
          id: 1,
          name: 'Superb Runner',
          color: 'BLUE',
          position
        },
        {
          id: 2,
          name: 'Awesome Fridge',
          color: 'GREEN',
          position
        },
        {
          id: 3,
          name: 'Great Bottle',
          color: 'ORANGE',
          position
        },
        {
          id: 4,
          name: 'Little Flower',
          color: 'YELLOW',
          position
        },
        {
          id: 5,
          name: 'Nice Rock',
          color: 'PURPLE',
          position
        }
      ])
    );
  }
}
