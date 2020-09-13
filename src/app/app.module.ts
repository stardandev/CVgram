import { CoverLetterFeatureKey } from './modules/shared/reducers/cover-letter.reducer';
import { UserDetailsFeatureKey } from './modules/shared/reducers/user-details.reducer';
import { environment } from 'src/environments/environment';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { TranslateModule, TranslateLoader, TranslatePipe } from '@ngx-translate/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './modules/shared/shared.module';
import { HomeModule } from './modules/home/home.module';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { StoreModule } from '@ngrx/store';
import { reducers } from './modules/shared/reducers';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { localStorageSync } from 'ngrx-store-localstorage';
import { ActionReducer, MetaReducer } from '@ngrx/store';
import * as fromGlobalConfig from '../app/modules/shared/reducers/global-config.reducer';
import * as fromUserContent from '../app/modules/shared/reducers/user-content.reducer';
import * as fromUserDetails from '../app/modules/shared/reducers/user-details.reducer';
import * as fromCoverLetter from '../app/modules/shared/reducers/cover-letter.reducer';
import { globalConfigFeatureKey } from './modules/shared/reducers/global-config.reducer';
import { UserContentFeatureKey } from './modules/shared/reducers/user-content.reducer';
import { AppInterceptor } from './modules/shared/services/app.interceptor';
import { NgxUiLoaderModule, NgxUiLoaderConfig, NgxUiLoaderService } from 'ngx-ui-loader';


const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  "bgsColor": "#005c97",
  "bgsOpacity": 1,
  "bgsPosition": "bottom-right",
  "bgsSize": 60,
  "bgsType": "ball-spin-clockwise",
  "blur": 0,
  "delay": 0,
  "fastFadeOut": true,
  "fgsColor": "#005c97",
  "fgsPosition": "center-center",
  "fgsSize": 70,
  "fgsType": "ball-spin",
  "gap": 24,
  "logoPosition": "center-center",
  "logoSize": 120,
  "logoUrl": "",
  "masterLoaderId": "master",
  "overlayBorderRadius": "0",
  "overlayColor": "rgba(40, 40, 40, 0.8)",
  "pbColor": "#005c97",
  "pbDirection": "ltr",
  "pbThickness": 3,
  "hasProgressBar": true,
  "text": "",
  "textColor": "#FFFFFF",
  "textPosition": "center-center",
};
// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

export function localStorageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
  return localStorageSync({ keys: [globalConfigFeatureKey, UserContentFeatureKey, UserDetailsFeatureKey, CoverLetterFeatureKey], rehydrate: true })(reducer);
}
const metaReducers: Array<MetaReducer<any, any>> = [localStorageSyncReducer];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    AppRoutingModule,
    HttpClientModule,
    SharedModule,
    HomeModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    BrowserAnimationsModule,
    DashboardModule,
    StoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true
      }
    }),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    StoreModule.forFeature(fromGlobalConfig.globalConfigFeatureKey, fromGlobalConfig.reducer),
    StoreModule.forFeature(fromUserContent.UserContentFeatureKey, fromUserContent.reducer),
    StoreModule.forFeature(fromUserDetails.UserDetailsFeatureKey, fromUserDetails.reducer),
    StoreModule.forFeature(fromCoverLetter.CoverLetterFeatureKey, fromCoverLetter.reducer),
  ],
  providers: [
    TranslatePipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AppInterceptor,
      multi: true
    },
    NgxUiLoaderService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
