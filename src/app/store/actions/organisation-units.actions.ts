import { createAction, props } from '@ngrx/store';
import { ErrorMessage } from 'src/app/core';
import {
  OrganisationUnitChildren,
  OrganisationUnit
} from 'src/app/models/organisation-unit.model';
import { Update } from '@ngrx/entity';

/**
 * orgunit children actions
 */
export const loadOrganisationUnitChildren = createAction(
  '[ORGANISATION UNIT] load children',
  props<{ dimensions: any }>()
);

export const loadOrganisationUnitChildrenSuccess = createAction(
  '[ORGANISATION UNIT] load children Success',
  props<{ children: OrganisationUnitChildren[] }>()
);

export const loadOrganisationUnitChildrenFail = createAction(
  '[ORGANISATION UNIT] load children Fail',
  props<{ error: ErrorMessage }>()
);

export const deleteOrganisationUnitChild = createAction(
  '[ORGANISATION UNIT] delete Organisation Unit',
  props<{ id: string }>()
);
export const deleteOrganisationUnitChildFail = createAction(
  '[ORGANISATION UNIT] delete Organisation Unit Fail',
  props<{ error: ErrorMessage }>()
);
export const deleteOrganisationUnitChildSuccess = createAction(
  '[ORGANISATION UNIT] delete Organisation Unit Success',
  props<{ id: string }>()
);

export const editOrganisationUnitChild = createAction(
  '[ORGANISATION UNIT] edit Organisation Unit ',
  props<{ child: OrganisationUnitChildren }>()
);

export const editOrganisationUnitChildFail = createAction(
  '[ORGANISATION UNIT] edit Organisation Unit Fail',
  props<{ error: ErrorMessage }>()
);
export const editOrganisationUnitChildSuccess = createAction(
  '[ORGANISATION UNIT] edit Organisation Unit Success',
  props<{ child: Update<OrganisationUnitChildren> }>()
);
export const clearOrganisationUnitChildren = createAction(
  '[ORGANISATION UNIT] clear organisation units'
);

/**
 * selected orgunit actions
 */
export const selectOrganisationUnit = createAction(
  '[ORGANISATION UNIT] select Organisation unit',
  props<{ id: string }>()
);

export const selectPeriod = createAction(
  '[PERIOD] select Period',
  props<{ pe: string }>()
);

export const selectOrganisationUnitFail = createAction(
  '[ORGANISATION UNIT] select Organisation unit Fail'
);

export const selectOrganisationUnitSuccess = createAction(
  '[ORGANISATION UNIT] select Organisation unit Success',
  props<{ dimensions: any }>()
);
