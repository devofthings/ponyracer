import { PonyModel, PonyWithPositionModel } from './pony.model';

export interface RaceModel {
  id: number;
  betPonyId?: number;
  name: string;
  ponies: Array<PonyModel>;
  startInstant: string;
  status?: 'PENDING' | 'RUNNING' | 'FINISHED';
}

export interface LiveRaceModel {
  ponies: Array<PonyWithPositionModel>;
  status: 'PENDING' | 'RUNNING' | 'FINISHED';
}
