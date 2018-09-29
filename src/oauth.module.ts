import {
  NgModule,
  ModuleWithProviders
} from '@angular/core';

@NgModule({

})
export class OAuthModule {

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: OAuthModule,
      providers: []
    };
  }

}
