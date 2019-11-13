import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { HomeComponent } from './pages';
import { CompletenessComponent } from './pages/completeness/completeness.component';
import { OrganisationUnitsComponent } from './pages/organisation-units/organisation-units.component';
import { OrganisationUnitEditComponent } from './pages/organisation-unit-edit/organisation-unit-edit.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: '', redirectTo: 'completeness', pathMatch: 'full' },
      { path: 'completeness', component: CompletenessComponent },
      {
        path: 'organisationunit/:parentid',
        component: OrganisationUnitsComponent
      },
      {
        path: 'organisationunit/:parentid/:childid',
        component: OrganisationUnitEditComponent
      }
    ]
  }
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
