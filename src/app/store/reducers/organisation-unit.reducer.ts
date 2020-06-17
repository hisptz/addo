/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { createReducer, on } from '@ngrx/store';
import {
  initialSelectedOrgunitState,
  SelectedOrgunitState,
  initialOrganisationUnitChildrenState,
  adapter,
  OrganisationUnitChildrenState,
} from '../states/organisation-unit.sate';
import {
  selectOrganisationUnitSuccess,
  selectOrganisationUnitFail,
  loadOrganisationUnitChildren,
  loadOrganisationUnitChildrenSuccess,
  loadOrganisationUnitChildrenFail,
  clearOrganisationUnitChildren,
  deleteOrganisationUnitChild,
  deleteOrganisationUnitChildFail,
  deleteOrganisationUnitChildSuccess,
  editOrganisationUnitChild,
  editOrganisationUnitChildFail,
  editOrganisationUnitChildSuccess,
} from '../actions';
import {
  loadingBaseState,
  loadedBaseState,
  errorBaseState,
} from '../states/base.state';

/**
 * selected orgunit reducer
 */
export const orgunitReducer = createReducer(
  initialSelectedOrgunitState,
  on(selectOrganisationUnitSuccess, (state, { dimensions }) => ({
    ...state,
    selectedOrgunit: dimensions,
    selected: true,
  })),
  on(selectOrganisationUnitFail, (state) => ({ ...state, selected: false }))
);

export function selectedOrganisationUnitReducer(
  state,
  action
): SelectedOrgunitState {
  return orgunitReducer(state, action);
}

export function selectStatus(state, action) {
  switch (action.type) {
    case 'SHOW_REPORTED':
      console.log('Existing State::', state);
      console.log('Action State::', state);
      return {
        ...state,
        showReported: action.payload,
      };
    default:
      return state;
  }
}

/**
 * orgunit children reducer
 */
export const orgunitChildrenReducer = createReducer(
  initialOrganisationUnitChildrenState,
  on(loadOrganisationUnitChildren, (state) => ({
    ...state,
    ...loadingBaseState,
  })),
  on(loadOrganisationUnitChildrenSuccess, (state, { children }) =>
    adapter.addMany(children, { ...state, ...loadedBaseState })
  ),
  on(loadOrganisationUnitChildrenFail, (state, { error }) => ({
    ...state,
    ...errorBaseState,
    error,
  })),
  on(clearOrganisationUnitChildren, (state) => adapter.removeAll(state)),
  on(deleteOrganisationUnitChild, (state) => ({
    ...state,
    deleted: false,
    deleting: false,
  })),
  on(deleteOrganisationUnitChildFail, (state, { error }) => ({
    ...state,
    deleted: false,
    deleting: false,
    hasError: true,
    error,
  })),
  on(deleteOrganisationUnitChildSuccess, (state, { id }) =>
    adapter.removeOne(id, { ...state, deleted: true, deleting: false })
  ),
  on(editOrganisationUnitChild, (state) => ({
    ...state,
    edited: false,
    editing: true,
  })),
  on(editOrganisationUnitChildFail, (state, { error }) => ({
    ...state,
    hasError: true,
    edited: false,
    editing: false,
    error,
  })),
  on(editOrganisationUnitChildSuccess, (state, { child }) =>
    adapter.updateOne(child, { ...state, edited: true, editing: false })
  )
);

export function organisationUnitChildrenReducer(
  state,
  action
): OrganisationUnitChildrenState {
  return orgunitChildrenReducer(state, action);
}
