export class AuthService {
  userRole : any
  token: any
  isLoggedIn() {
    return this.token != "";
  }

  getUserRole() {
    return this.userRole;
  }
}
