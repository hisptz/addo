/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatFormFieldModule,
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { NgxDhis2PeriodFilterModule } from '@iapps/ngx-dhis2-period-filter';

import { reducers, metaReducers } from './store/reducers';
import { effects } from './store/effects';

import {
  RouterStateSerializer,
  StoreRouterConnectingModule,
} from '@ngrx/router-store';
import { RouteSerializer, CoreModule } from './core';
import { RoutingModule } from './app.routes';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { NgxDhis2MenuModule } from '@iapps/ngx-dhis2-menu';
import { NgxDhis2OrgUnitFilterModule } from '@iapps/ngx-dhis2-org-unit-filter';
import * as fromPages from './pages';
import { ServiceWorkerModule } from '@angular/service-worker';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { OrganisationUnitDetailsComponent } from './pages/organisation-unit-details/organisation-unit-details.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { OrganisationUnitEditComponent } from './pages/organisation-unit-edit/organisation-unit-edit.component';
import { SmsComponent } from './pages/sms/sms.component';
import { SmseditComponent } from './pages/smsedit/smsedit.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatRadioModule } from '@angular/material/radio';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { NgxDhis2HttpClientModule } from '@iapps/ngx-dhis2-http-client';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { SharedModule } from './shared/shared.module';
import { NgxDhis2SelectionFiltersModule } from '@iapps/ngx-dhis2-selection-filters';
import { DragulaModule } from 'ng2-dragula';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    ...fromPages.pages,
    SmsComponent,
    SmseditComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RoutingModule,
    SharedModule,
    CoreModule.forRoot({
      namespace: 'iapps',
      version: 1,
      models: {
        users: 'id',
      },
    }),
    BrowserAnimationsModule,
    StoreModule.forRoot(reducers, { metaReducers }),
    EffectsModule.forRoot(effects),
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatDialogModule,
    MatSnackBarModule,
    MatNativeDateModule,
    MatProgressBarModule,
    MatButtonToggleModule,
    Ng2SearchPipeModule,
    NgxDhis2SelectionFiltersModule,
    NgxPaginationModule,
    MatRadioModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    DragulaModule,

    /**
     * Menu  module
     */
    NgxDhis2MenuModule,

    /**
     * Organisationunit filter module
     */
    NgxDhis2OrgUnitFilterModule,
    NgxDhis2HttpClientModule.forRoot({
      version: 1,
      namespace: 'addo',
      models: {
        organisationUnits: 'id,level',
        organisationUnitLevels: 'id,level',
        organisationUnitGroups: 'id',
      },
    }),
    NgxDhis2PeriodFilterModule,

    /**
     * Translation module
     */
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),

    /**
     * @ngrx/router-store keeps router state up-to-date in the store
     */
    StoreRouterConnectingModule.forRoot(),

    !environment.production ? StoreDevtoolsModule.instrument() : [],

    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
    }),
    MatMenuModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatTabsModule,
    MatSelectModule,
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
    }),
  ],
  entryComponents: [
    OrganisationUnitDetailsComponent,
    OrganisationUnitEditComponent,
    SmseditComponent,
  ],
  providers: [
    { provide: RouterStateSerializer, useClass: RouteSerializer },
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'fill' },
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
