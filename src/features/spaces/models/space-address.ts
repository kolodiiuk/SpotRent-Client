export interface SpaceAddress {
  id: number;
  building: string;
  street: string;
  city: string;
  region: string;
}

export interface CreateSpaceAddressRequest {
  building: string;
  street: string;
  city: string;
  region: string;
}
