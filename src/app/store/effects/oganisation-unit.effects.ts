import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { OrganisationUnitService } from 'src/app/services/organisation-unit.service';
import {
  selectOrganisationUnitSuccess,
  loadOrganisationUnitChildrenSuccess,
  loadOrganisationUnitChildrenFail,
  loadOrganisationUnitChildren,
  editOrganisationUnitChild,
  editOrganisationUnitChildSuccess,
  editOrganisationUnitChildFail,
  deleteOrganisationUnitChild,
  deleteOrganisationUnitChildSuccess,
  deleteOrganisationUnitChildFail
} from '../actions';
import { ErrorMessage } from 'src/app/core/models/error-message.model';
import { switchMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class OrganisationUnitEffects {
  constructor(
    private actions$: Actions,
    private orgunitService: OrganisationUnitService,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {}

  selectOrganisationUnit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(selectOrganisationUnitSuccess),
      switchMap(action =>
        of(loadOrganisationUnitChildren({ id: action.organisationUnit.id }))
      )
    )
  );
  loadOrganisationUnitChildren$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadOrganisationUnitChildren),
      switchMap(action =>
        this.orgunitService.getOrgunitChildren(action.id).pipe(
          map(organisationUnitChildren =>
            loadOrganisationUnitChildrenSuccess({
              children: organisationUnitChildren ? organisationUnitChildren.organisationUnits : []
            })
          ),
          catchError(err =>
            of(loadOrganisationUnitChildrenFail({ error: err }))
          )
        )
      )
    )
  );

  editOrganisationUnitChild$ = createEffect(() =>
    this.actions$.pipe(
      ofType(editOrganisationUnitChild),
      switchMap(action => {
        this._snackBar.open(`Editing ${action.child.name}`, '', {
          duration: 2000
        });
        return this.orgunitService.editOrgunitChildren(action.child).pipe(
          map(() => {
            this._snackBar.open(`Edited Successfully`, '', {
              duration: 2000
            });
            this.router.navigate([
              `/organisationunit/${action.child.parent.id}`
            ]);
            return editOrganisationUnitChildSuccess({
              child: { id: action.child.id, changes: action.child }
            });
          }),
          catchError(error => {
            this._snackBar.open(`Filed To Edit`, '', {
              duration: 2000
            });
            return of(editOrganisationUnitChildFail({ error: error }));
          })
        );
      })
    )
  );

  deleteOrganisationUnitChild$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteOrganisationUnitChild),
      switchMap(action => {
        this._snackBar.open(`Deleting Organisation Unit`, '', {
          duration: 1000
        });
        return this.orgunitService.deleteOrgunitChild(action.id).pipe(
          map(() => {
            this._snackBar.open(`Deleted Successfully`, '', {
              duration: 2000
            });
            return deleteOrganisationUnitChildSuccess({ id: action.id });
          }),
          catchError((error: ErrorMessage) => {
            this._snackBar.open(error.message, '', {
              duration: 2000
            });
            return of(deleteOrganisationUnitChildFail({ error: error }));
          })
        );
      })
    )
  );
}
