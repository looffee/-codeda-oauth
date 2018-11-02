import { Injectable } from '@angular/core';

import { OAuthGuard } from './oauth.guard';

import {
  Observable,
  Observer
} from 'rxjs';

declare const IN: any;
declare const FB: any;
declare const gapi: any;

interface UserSocialProfile {

  fullName: string;
  email: string;

}

@Injectable()
export class OAuthService {

  constructor(
    private oauthGuard: OAuthGuard
  ) {}

  signInByLinkedIn(): Observable<UserSocialProfile> {
    return Observable.create((observer: Observer<UserSocialProfile>) => {
      IN
        .User
        .authorize(() => {
          IN
            .API
            .Profile('me')
            .fields(
              'first-name',
              'last-name',
              'email-address'
            )
            .result((result: {
              values: Array<{
                emailAddress: string;
                firstName: string;
                lastName: string;
              }>
            }) => {
              const user = result.values[0];

              observer.next({
                fullName: `${user.firstName} ${user.lastName}`,
                email: user.emailAddress
              });
              observer.complete();
            })
            .error(error => {
              observer.error(error);
            });
      });
    });
  }

  signInByFacebook(): Observable<UserSocialProfile> {
    return Observable.create((observer: Observer<UserSocialProfile>) => {
      FB.login(
        (response) => {
          if (response.authResponse) {
            FB.api(
              '/me',
              {
                fields: 'last_name,first_name,email'
              },
              (user: {
                last_name: string;
                first_name: string;
                email: string
              }) => {
                observer.next({
                  fullName: `${user.first_name} ${user.last_name}`,
                  email: user.email
                });
                observer.complete();
              }
            );
          } else {
            observer.error(response);
          }
        }
      );
    });
  }

  signInByGoogle(): Observable<UserSocialProfile> {
    return Observable.create((observer: Observer<UserSocialProfile>) => {
      const authInstance = gapi.auth2.getAuthInstance();
      const options = new gapi.auth2.SigninOptionsBuilder();
      options.setPrompt('select_account');

      authInstance
        .signIn(options)
        .then(
          () => {
            const user = authInstance
              .currentUser
              .get()
              .getBasicProfile();

            observer.next({
              fullName: user.getName(),
              email: user.getEmail()
            });
          },
          error => observer.error(error)
        );
    });
  }

  logout(): void {
    if (location.hostname === 'localhost') {
      return;
    }

    this.signOutByFacebook();
    this.signOutByGoogle();
    this.signOutByLinkedIn();
  }

  private signOutByLinkedIn(): void {
    if (this.oauthGuard.available.in === false) {
      return;
    }

    const isSignedIn: boolean = IN
      .User
      .isAuthorized();

    if (isSignedIn === true) {
      IN.User.logout(() => null);
    }
  }

  private signOutByFacebook(): void {
    if (this.oauthGuard.available.fb === false) {
      return;
    }

    FB.getLoginStatus(response => {
      if (response.status === 'connected') {
        FB.logout(() => null);
      }
    });
  }

  private signOutByGoogle(): void {
    if (this.oauthGuard.available.gplus === false) {
      return;
    }

    const isSignedIn: boolean = gapi
      .auth2
      .getAuthInstance()
      .isSignedIn
      .get();

    if (isSignedIn === true) {
      gapi
        .auth2
        .getAuthInstance()
        .signOut()
        .then(() => null);
    }
  }

}
