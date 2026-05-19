import {SpaceType} from './space-type';

export interface SpaceFilterParams {
  spaceType?: SpaceType;
  minCapacity?: number;
  maxCapacity?: number;
  minAreaSqm?: number;
  maxAreaSqm?: number;
  minHourlyRate?: number;
  maxHourlyRate?: number;
  city?: string;
  sort?: string;
  limit?: number;
  offset?: number;
}
