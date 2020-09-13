import {createAction, props} from '@ngrx/store';

export enum CoverLetterActionTypes {
  updateCoverLetter = '[Cover Letter] Update Cover Letter Content',
  updateCoverLetterTemplate = '[Cover Letter] Update Cover Letter Template',
  resetCoverLetter = '[Cover Letter] Reset Cover Letter'
}

export const updateCoverLetter = createAction<CoverLetterActionTypes, {}>(CoverLetterActionTypes.updateCoverLetter, props<{ data: any}>());
export const updateCoverLetterTemplate = createAction<CoverLetterActionTypes, {}>(CoverLetterActionTypes.updateCoverLetterTemplate, props<{ data: any}>());
export const resetCoverLetter = createAction<CoverLetterActionTypes, {}>(CoverLetterActionTypes.resetCoverLetter, props<{}>());
