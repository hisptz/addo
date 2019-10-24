import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { BaseState, initialBaseState } from './base.state';
import {
  OrganisationUnitChildren,
  OrganisationUnit
} from 'src/app/models/organisation-unit.model';

/**
 * organisation unit children state
 */
export interface OrganisationUnitChildrenState
  extends BaseState,
    EntityState<OrganisationUnitChildren> {
  editing: boolean;
  edited: boolean;
  deleting: boolean;
  deleted: boolean;
}

export function selectOrgunitChildId(child: OrganisationUnitChildren) {
  return child.id;
}

export const adapter = createEntityAdapter({
  selectId: selectOrgunitChildId,
  sortComparer: false
});

export const initialOrganisationUnitChildrenState = adapter.getInitialState({
  ...initialBaseState,
  editing: false,
  edited: false,
  deleting: false,
  deleted: false
});

export const {
  selectAll: selectAllOrgunitChildren,
  selectIds: seleOrgunitChildrenIds,
  selectEntities: selectOrgunitChildrenEntities
} = adapter.getSelectors();

/**
 * selected organisation unit state
 */
export interface SelectedOrgunitState {
  selectedOrgunit: OrganisationUnit;
  selected: boolean;
}

export const initialSelectedOrgunitState: SelectedOrgunitState = {
  selectedOrgunit: null,
  selected: false
};

export const getSelectedOrguni = (state: SelectedOrgunitState) =>
  state.selectedOrgunit;
