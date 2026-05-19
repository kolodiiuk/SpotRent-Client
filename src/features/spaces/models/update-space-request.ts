import {AttributeValue} from './attribute-value';
import {SpaceType} from './space-type';
import {WorkingHours} from './working-hours';

export interface UpdateSpaceRequest {
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
  ownerId: number;
  workingHours?: WorkingHours[];
  attributeValues?: AttributeValue[];
}
