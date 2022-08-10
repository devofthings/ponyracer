import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
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
}
