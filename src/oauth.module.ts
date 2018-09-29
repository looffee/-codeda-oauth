import {
  NgModule,
  ModuleWithProviders
} from '@angular/core';

import { OAuthGuard } from './oauth.guard';
import { OAuthService } from './oauth.service';
import {
  Config,
  CONFIG
} from './congif';

@NgModule({})
export class OAuthModule {

  static forRoot(config: Config): ModuleWithProviders {
    return {
      ngModule: OAuthModule,
      providers: [
        {
          provide: CONFIG,
          useValue: config
        },
        OAuthGuard,
        OAuthService
      ]
    };
  }

}
