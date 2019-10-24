import { routerReducer, RouterReducerState } from '@ngrx/router-store';
import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { storeFreeze } from 'ngrx-store-freeze';

import { environment } from '../../../environments/environment';
import { SystemInfoState } from '../states/system-info.state';
import { UserState } from '../states/user.state';
import { systemInfoReducer } from './system-info.reducer';
import { userReducer } from './user.reducer';
import {
  SelectedOrgunitState,
  OrganisationUnitChildrenState
} from '../states/organisation-unit.sate';
import {
  selectedOrganisationUnitReducer,
  organisationUnitChildrenReducer
} from './organisation-unit.reducer';

export interface State {
  user: UserState;
  systemInfo: SystemInfoState;
  router: RouterReducerState;
  selectedOrganisationUnit: SelectedOrgunitState;
  organisationUnitChildren: OrganisationUnitChildrenState;
}

export const reducers: ActionReducerMap<State> = {
  user: userReducer,
  systemInfo: systemInfoReducer,
  router: routerReducer,
  selectedOrganisationUnit: selectedOrganisationUnitReducer,
  organisationUnitChildren: organisationUnitChildrenReducer
};

export const metaReducers: MetaReducer<State>[] = !environment.production
  ? [storeFreeze]
  : [];

/**
 * Root state selector
 */
export const getRootState = (state: State) => state;
