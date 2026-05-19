import {Address} from "../../user-profile/models/address.model";
import {AttributeInfo} from './attribute-info';
import {UserDto} from '../../user-profile/models/user-dto';
import {AttributeValue} from './attribute-value';
import {SpaceType} from './space-type';
import {WorkingHours} from './working-hours';

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
  ownerDto: UserDto | null;
  workingHours: WorkingHours[];
  attributes?: AttributeInfo[];
  attributeValues?: AttributeValue[];
}
