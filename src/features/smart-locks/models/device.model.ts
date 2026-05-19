import type { Space } from '../../spaces/models/space.model';
import type { AccessLogEntry } from '../../access-logs/models/access-log.model';

export enum LockStatus {
  Locked = 0,
  Unlocked = 1,
  Error = 2,
  Offline = 3,
}

export interface Device {
  id: number;
  spaceId: number;
  deviceName: string;
  status: LockStatus | null;
  isOnline: boolean;
  installedAt: string;
  updatedAt: string;
  space: Space | null;
  accessLogs: AccessLogEntry[];
}
