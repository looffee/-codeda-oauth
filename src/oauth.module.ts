import {
  NgModule,
  ModuleWithProviders
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { OAuthGuard } from './oauth.guard';
import { OAuthService } from './oauth.service';
import {
  Config,
  CONFIG
} from './congif';

@NgModule({
  imports: [
    CommonModule
  ]
})
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
