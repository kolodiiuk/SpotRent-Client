import { Address } from "./address.model";

export enum SpaceType {
  None = 0,
  Desk = 1 << 0,
  Coworking = 1 << 1,
  PrivateOffice = 1 << 2,
  ConferenceRoom = 1 << 3,
  PhotoShoot = 1 << 4,
  Workshop = 1 << 5,
}

export interface WorkingHours {
  id?: number;
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
}

export interface AttributeInfo {
  id: number;
  name: string;
  dataType: string;
  unit?: string;
}

export interface AttributeValue {
  id?: number;
  attributeId: number;
  value?: string;
  minValue?: number;
  maxValue?: number;
}

export interface Space {
  id: number;
  name: string;
  description: string;
  spaceType: SpaceType;
  room?: string;
  capacity: number;
  areaSqm: number;
  hourlyRate: number;
  addressId: number;
  address?: Address;
  imageUrl?: string;
  isAvailable: boolean;
  createdAt: string;
  ownerId: number;
  workingHours: WorkingHours[];
  attributes?: AttributeInfo[];
  attributeValues?: AttributeValue[];
}

export interface SpaceFilterParams {
  spaceType?: SpaceType;
  minCapacity?: number;
  maxCapacity?: number;
  minAreaSqm?: number;
  maxAreaSqm?: number;
  minHourlyRate?: number;
  maxHourlyRate?: number;
  city?: string;
  attributes?: string;
  sort?: string;
  limit?: number;
  offset?: number;
}

export interface PagedSpacesResponse {
  items: Space[];
  totalItems: number;
  page: number;
  pageSize: number;
}

export interface SpaceScheduleEntry {
  startTime: string;
  endTime: string;
}

export interface SpaceSchedule {
  spaceId: number;
  bookings: SpaceScheduleEntry[];
}

export interface SpaceAvailabilityQuery {
  startTime: string;
  endTime: string;
  city: string;
}

export interface CreateSpaceRequest {
  name: string;
  description: string;
  spaceType: SpaceType;
  room?: string;
  capacity: number;
  areaSqm: number;
  hourlyRate: number;
  addressId: number;
  imageUrl?: string;
  isAvailable: boolean;
  createdAt?: string;
  workingHours?: WorkingHours[];
  attributeValues?: AttributeValue[];
}

export interface UpdateSpaceRequest extends CreateSpaceRequest {
  ownerId?: number;
  attributeValues?: AttributeValue[];
}

export const spaceTypeLabels: Record<SpaceType, string> = {
  [SpaceType.None]: 'Unspecified',
  [SpaceType.Desk]: 'Desk',
  [SpaceType.Coworking]: 'Coworking',
  [SpaceType.PrivateOffice]: 'Private Office',
  [SpaceType.ConferenceRoom]: 'Conference Room',
  [SpaceType.PhotoShoot]: 'Photo Shoot',
  [SpaceType.Workshop]: 'Workshop',
};
