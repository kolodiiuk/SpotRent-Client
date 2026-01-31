import { UserRole } from "./user-role.model";

export interface User {
  id: number;
  firstName: string;
  secondName: string;
  email: string;
  phoneNumber: string;
  role: UserRole;
}
