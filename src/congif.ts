import { InjectionToken } from '@angular/core';

export interface Config {

  google?: {
    clientId: string;
  };
  linkedIn?: {
    api_key: string;
  };
  facebook?: {
    appId: string;
  };

}

export const CONFIG = new InjectionToken<Config>('config');
