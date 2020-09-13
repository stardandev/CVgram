import {createAction, props} from '@ngrx/store';
import { UserContentRepresentation, ResumePageBounds } from '../models/user-content-representation';
import { AppUser } from '../models/AppUser';

export enum UserDetailsActionTypes {
  startUserSession = '[User Details] Start User Session',
  deleteUserSession = '[User Details] Delete User Session'
}

  export const startUserSession = createAction<UserDetailsActionTypes, {}>(UserDetailsActionTypes.startUserSession, props<{ user: AppUser[] }>());
  export const deleteUserSession = createAction<UserDetailsActionTypes, {}>(UserDetailsActionTypes.deleteUserSession, props<{}>());
