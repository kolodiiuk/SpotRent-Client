import {AttributeValue} from './attribute-value';
import {SpaceType} from './space-type';
import {WorkingHours} from './working-hours';
import {CreateSpaceAddressRequest} from './space-address';

export interface CreateSpaceRequest {
  name: string;
  description: string;
  spaceType: SpaceType;
  room?: string;
  capacity: number;
  areaSqm: number;
  hourlyRate: number;
  addressId?: number;
  address?: CreateSpaceAddressRequest;
  imageUrl?: string;
  isAvailable: boolean;
  createdAt?: string;
  workingHours?: WorkingHours[];
  attributeValues?: AttributeValue[];
}
