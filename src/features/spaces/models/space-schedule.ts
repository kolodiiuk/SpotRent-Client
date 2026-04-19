import {SpaceScheduleEntry} from "./space-schedule-entry";

export interface SpaceSchedule {
  spaceId: number;
  bookings: SpaceScheduleEntry[];
}
