import {
  Injectable,
  NgZone,
  Inject
} from '@angular/core';
import { CanActivate } from '@angular/router';

import {
  Config,
  CONFIG
} from './congif';

import {
  Observable,
  Observer,
  forkJoin
} from 'rxjs';

declare const gapi: any;
declare const FB: any;

function insertScript(
  src: string,
  innerHTML?: string
): {
  element: HTMLScriptElement,
  insert: () => void
} {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = true;
  script.src = src;
  script.innerHTML = innerHTML;

  return {
    element: script,
    insert: () => {
      document
        .body
        .appendChild(script);
    }
  };
}

@Injectable()
export class OAuthGuard implements CanActivate {

  private inited = false;

  constructor(
    private zone: NgZone,
    @Inject(CONFIG) private config: Config
  ) {}

  canActivate(): Observable<boolean> | boolean {
    if (
      location.hostname === 'localhost' ||
      this.inited === true
    ) {
      return true;
    }

    return Observable.create((observer: Observer<boolean>) => {
      forkJoin([
        this.initFacebookSdk(),
        this.initGoogleSdk(),
        this.initLinkedInSdk()
      ])
      .subscribe(() => {
        this.inited = true;
        this.zone.run(() => {
          observer.next(true);
          observer.complete();
        });
      });
    });
  }

  private initFacebookSdk(): Observable<void> {
    return Observable.create((observer: Observer<void>) => {
      const script = insertScript('https://connect.facebook.net/en_US/sdk.js');
      script.element.id = 'facebook-jssdk';

      window['fbAsyncInit'] = () => {
        FB.init({
          appId: this.config.facebook.appId,
          autoLogAppEvents: true,
          xfbml: true,
          version: 'v3.0'
        });

        delete window['fbAsyncInit'];

        observer.next(undefined);
        observer.complete();
      };

      script.insert();
    });
  }

  private initGoogleSdk(): Observable<void> {
    return Observable.create((observer: Observer<void>) => {
      const script = insertScript('https://apis.google.com/js/api.js');

      script.element.onload = () => {
        gapi.load('client', () => {
          gapi.client.init({
            'discoveryDocs': ['https://people.googleapis.com/$discovery/rest'],
            'clientId': this.config.google.clientId,
            'scope': 'profile',
          })
          .then(() => {
            observer.next(undefined);
            observer.complete();
          });
        });
      };

      script.insert();
    });
  }

  private initLinkedInSdk(): Observable<void> {
    return Observable.create((observer: Observer<void>) => {
      const script = insertScript(
        '//platform.linkedin.com/in.js',
        `api_key: ${this.config.linkedIn.api_key} \n onLoad: onLoadLinkedInSdk`
      );

      window['onLoadLinkedInSdk'] = () => {
        delete window['onLoadLinkedInSdk'];

        observer.next(undefined);
        observer.complete();
      };

      script.insert();
    });
  }

}
