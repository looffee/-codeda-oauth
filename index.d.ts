import { ModuleWithProviders } from '@angular/core';
import { CanActivate } from '@angular/router';

import { Config } from './src/congif';

import { Observable } from 'rxjs';

export class OAuthModule {

  static forRoot(config: Config): ModuleWithProviders;

}

export interface UserSocialProfile {

  fullName: string;
  email: string;

}

export class OAuthService {

  signInByLinkedIn(): Observable<UserSocialProfile>;
  signInByFacebook(): Observable<UserSocialProfile>;
  signInByGoogle(): Observable<UserSocialProfile>;
  logout(): void;

}

export class OAuthGuard implements CanActivate {

  canActivate(): Observable<boolean> | boolean;

}

