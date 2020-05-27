import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { OrganisationUnitsComponent } from './pages/organisation-units/organisation-units.component';
import { OrganisationUnitEditComponent } from './pages/organisation-unit-edit/organisation-unit-edit.component';
import { SmsComponent } from './pages/sms/sms.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: "one",
    pathMatch: 'full',
  },

  { path: 'facilities', component: OrganisationUnitsComponent },
  {
    path: 'organisationunit/:parentid',
    component: OrganisationUnitsComponent
  },
  {
    path: 'organisationunit/:parentid/:childid',
    component: OrganisationUnitEditComponent
  },
  {path: 'performancesms', component: SmsComponent}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
      preloadingStrategy: PreloadAllModules
    })
  ],
  exports: [RouterModule]
})
export class RoutingModule {}
