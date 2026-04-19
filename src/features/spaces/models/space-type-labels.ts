import {SpaceType} from './space-type';

export const spaceTypeLabels: Record<SpaceType, string> = {
  [SpaceType.None]: 'Unspecified',
  [SpaceType.Desk]: 'Desk',
  [SpaceType.Coworking]: 'Coworking',
  [SpaceType.PrivateOffice]: 'Private Office',
  [SpaceType.ConferenceRoom]: 'Conference Room',
  [SpaceType.PhotoShoot]: 'Photo Shoot',
  [SpaceType.Workshop]: 'Workshop',
};
