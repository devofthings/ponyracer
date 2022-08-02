import { PonyModel } from './pony.model';

export interface RaceModel {
  name: string;
  ponies: PonyModel[];
  id: number;
  startInstant: string;
}
