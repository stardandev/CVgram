import {createAction, props} from '@ngrx/store';

export enum UserContentActionTypes {
  updateUserContent = '[User Content] Update User Content',
  resetuserContent = '[User Content] Reset User Content'
}

export const updateUserContent = createAction<UserContentActionTypes, {}>(UserContentActionTypes.updateUserContent, props<{ content: any, sectionIdOfOpenAccordion: string }>());
export const resetuserContent = createAction<UserContentActionTypes, {}>(UserContentActionTypes.resetuserContent, props<{}>());
