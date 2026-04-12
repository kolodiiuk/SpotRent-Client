import { Injectable } from '@angular/core';
import { Observable, map, of, catchError, tap } from 'rxjs';
import { AuthApiService } from './api/auth-api.service';
import { AuthStorageService } from './auth-storage.service';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class GoogleAuthService {

  constructor(
    private api: AuthApiService,
    private storage: AuthStorageService,
    private authService: AuthService
  ) { }

  loginWithGoogle(credential: string): Observable<boolean> {
    return this.api.googleLogin(credential)
      .pipe(
        tap(response => {
          this.storage.setTokens(response.token, response.refreshToken);
          this.storage.setUser(response.user);
          this.authService.updateUserState(response.user);
        }),
        map(() => true),
        catchError(err => {
          console.error('Google login error', err);

          return of(false);
        })
      );
  }
}
