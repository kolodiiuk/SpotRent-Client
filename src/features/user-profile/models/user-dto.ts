import {UserRole} from "../../auth/models/user-role.model";

export interface UserDto {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phoneNumber: string;
}
