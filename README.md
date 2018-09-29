# @codeda/oauth
Angular module for authorization by social networks.
# Installation
Using npm:
```
$ npm install @codeda/oauth
```
Using yarn:
```
$ yarn add @codeda/oauth
```
# Usage
1. Import ```OAuthModule```:
```import { OAuthModule } from '@codeda/oauth';```
2. Import it into you application module:
```
@NgModule({
  imports:[
    OAuthModule.forRoot({
      google: {
        clientId: ${yourClientIdHere}  
      },
      linkedIn: {
        api_key: ${yourApiKeyHere}
      },
      facebook: {
        appId: ${yourAppIdHere}
      }
    })
  ]
})
export class AppModule {}
```
3. Add ``OAuthGuard`` into main route:
```
const routes: Routes = [
  {
    path: '',
    canActivate: [OAuthGuard],
    children: [...]
  }
];
```
4. Now you can use ```OAuthService``` for authorization:
```
import { OAuthService } from '@codeda/oauth';

@Component({...})
export class MyComponent {
    
  constructor(oauth: OAuthService) {
    oauth
      .signInByGoogle()
      .subscribe(user => console.log(user));
  }

}
```
