import { createSelector } from '@ngrx/store';
import * as _ from 'lodash';

import { getRootState, State } from '../reducers';
import {
  SelectedOrgunitState,
  selectAllOrgunitChildren,
  OrganisationUnitChildrenState
} from '../states/organisation-unit.sate';

/**
 * selected ogunit selectors
 */
export const getOrganisationUnitState = createSelector(
  getRootState,
  (state: State) => state.selectedOrganisationUnit
);

export const getSelectedOrganisationUnit = createSelector(
  getOrganisationUnitState,
  (state: SelectedOrgunitState) => state.selectedOrgunit
);

export const getSelectedOrganisationUnitStatus = createSelector(
  getOrganisationUnitState,
  (state: SelectedOrgunitState) => state.selected
);

/**
 * orgunit children selectors
 */
export const getOrganisationUnitChildrenState = createSelector(
  getRootState,
  (state: State) => state.organisationUnitChildren
);

export const getOrganisationUnitChildren = createSelector(
  getOrganisationUnitChildrenState,
  selectAllOrgunitChildren
);

export const getOrganisationUnitChildrenLoadedState = createSelector(
  getOrganisationUnitChildrenState,
  (state: OrganisationUnitChildrenState) => state.loaded
);

export const getSelectedOrgunitChild = id =>
  createSelector(
    getOrganisationUnitChildren,
    children => _.find(children, child => child.id === id)
  );
export const getSelectedOrgunitChildChildren = id =>
  createSelector(
    getOrganisationUnitChildren,
    children => _.find(children, child => child.id === id).children
  );

export const leafOrgunit = createSelector(
  getOrganisationUnitChildren,
  children => children.length === 0
);
