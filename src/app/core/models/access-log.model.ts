export enum AccessType {
  Entry = 0,
  Exit = 1,
  AccessDenied = 2,
}

export interface AccessLogUserInfo {
  id: number;
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface AccessLogSpaceInfo {
  id: number;
  name?: string;
  ownerId?: number;
}

export interface AccessLogDeviceInfo {
  id: number;
  name?: string;
  serialNumber?: string;
}

export interface AccessLogEntry {
  id: number;
  userId?: number | null;
  spaceId?: number | null;
  deviceId?: number | null;
  accessType: AccessType | number;
  timestamp: string;
  Timestamp?: string;
  isSuccessful: boolean;
  errorMessage?: string | null;
  user?: AccessLogUserInfo | null;
  space?: AccessLogSpaceInfo | null;
  device?: AccessLogDeviceInfo | null;
}

export interface LogAccessPayload {
  userId: number;
  deviceId: number;
  accessType: AccessType;
  isSuccessful: boolean;
  bookingId?: number;
  errorMessage?: string;
}

export interface AccessLogCreateResponse {
  id: number;
}

export const accessTypeLabel = (type: AccessType | number): string => {
  switch (type) {
    case AccessType.Entry:
      return 'Entry';
    case AccessType.Exit:
      return 'Exit';
    case AccessType.AccessDenied:
      return 'Access Denied';
    default:
      return 'Unknown';
  }
};

export const accessResultLabel = (isSuccessful: boolean): string =>
  isSuccessful ? 'Granted' : 'Denied';

export const accessResultVariant = (isSuccessful: boolean): 'success' | 'danger' | 'warning' =>
  isSuccessful ? 'success' : 'danger';
