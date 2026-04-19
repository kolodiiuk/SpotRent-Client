import {Space} from "./space.model";

export interface PagedSpacesResponse {
  items: Space[];
  totalItems: number;
  page: number;
  pageSize: number;
}
