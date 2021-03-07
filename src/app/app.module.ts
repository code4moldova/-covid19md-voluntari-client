import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { appRoutes } from './app.routes';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpClientModule,
} from '@angular/common/http';
import { AuthInterceptor } from '@shared/interceptors/auth.interceptor';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { ErrorInterceptor } from '@shared/interceptors/error.interceptor';
import { NotificationInterceptor } from '@shared/interceptors/notification.interceptor';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgxMaskModule } from 'ngx-mask';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { environment } from '../environments/environment';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { CommonModule } from '@angular/common';
import { usersReducer } from '@users/users.reducer';
import { UsersEffects } from '@users/users.effects';
import { volunteersReducer } from '@volunteers/volunteers.reducer';
import { VolunteersEffects } from '@volunteers/volunteers.effects';
import { demandsReducer } from '@demands/demands.reducer';
import { DemandsEffects } from '@demands/demands.effects';
import { authReducer } from '@auth/auth.reducer';
import { AuthEffects } from '@auth/auth.effects';
import { beneficiariesReducer } from '@beneficiaries/beneficiaries.reducer';
import { BeneficiariesEffects } from '@beneficiaries/beneficiaries.effects';
import config from '@arcgis/core/config';

config.assetsPath = '/assets';

@NgModule({
  declarations: [AppComponent],
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    StoreModule.forRoot({}, {}),
    StoreModule.forFeature('auth', authReducer),
    StoreModule.forFeature('beneficiaries', beneficiariesReducer),
    StoreModule.forFeature('demands', demandsReducer),
    StoreModule.forFeature('volunteers', volunteersReducer),
    StoreModule.forFeature('users', usersReducer),
    EffectsModule.forRoot([
      AuthEffects,
      BeneficiariesEffects,
      VolunteersEffects,
      DemandsEffects,
      UsersEffects,
    ]),
    environment.production
      ? []
      : StoreDevtoolsModule.instrument({
          maxAge: 25, // Retains last 25 states
          logOnly: environment.production,
        }),
    MatSnackBarModule,
    MatIconModule,
    RouterModule.forRoot(appRoutes),
    NgxMaskModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: TranslateHttpLoader,
        deps: [HttpClient],
      },
      defaultLanguage: 'ro',
    }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: NotificationInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
