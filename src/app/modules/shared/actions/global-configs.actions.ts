import {createAction, props} from '@ngrx/store';
import { UserContentRepresentation, ResumePageBounds } from '../models/user-content-representation';
import { AppUser } from '../models/AppUser';

export enum GlobalConfigsActionTypes {
  UpdateUserContentRepresentation = '[GlobalConfigs] Update userContentRepresentation',
  ResetGlobalConfig = '[GlobalConfigs] Reset Global Config',
  updateResumePageBounds = '[GlobalConfigs] Update Resume Page Bounds',
  updateUserRegistrationKey = '[GlobalConfigs] Update User registration key',
  updateUserResetPasswordData = '[GlobalConfigs] Update User Password rest data'
}


export const UpdateUserContentRepresentation = createAction<GlobalConfigsActionTypes,
  {}>(GlobalConfigsActionTypes.UpdateUserContentRepresentation, props<{ userContentRepresentation: UserContentRepresentation }>());
  export const resetGlobalConfig = createAction<GlobalConfigsActionTypes, {}>(GlobalConfigsActionTypes.ResetGlobalConfig, props<{}>());
  export const updateResumePageBounds = createAction<GlobalConfigsActionTypes, {}>(GlobalConfigsActionTypes.updateResumePageBounds, props<{resumePageBounds: ResumePageBounds}>());
  export const updateUserRegistrationKey = createAction<GlobalConfigsActionTypes, {}>(GlobalConfigsActionTypes.updateUserRegistrationKey, props<{key: string}>());
  export const updateUserResetPasswordData = createAction<GlobalConfigsActionTypes, {}>(GlobalConfigsActionTypes.updateUserResetPasswordData, props<{data : any}>());
