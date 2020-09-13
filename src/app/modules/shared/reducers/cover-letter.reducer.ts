
import { Action } from '@ngrx/store';
import { CoverLetter, CoverLetterTemplate } from '../../dashboard/models/cover-letter';
import { CoverLetterActionTypes } from '../actions/cover-letter.actions';


export const CoverLetterFeatureKey = 'coverLetter';

export interface State {
    coverLetter: CoverLetter;
    coverLetterTemplate: any;
}

export const initialState: State = {
    coverLetter : {
      applicantAddress:'',
      body :'',
      companyAddress :'',
      companyName :'',
      coverLetterTemplateId :'',
      createdAt : null,
      customerId :'',
      email :'',
      footer :'',
      header :'',
      hiringManager :'',
      name :'',
      type: '',
      applicantName: '',
      applicantPhoneNumber: '',
      re: ''
    },
    coverLetterTemplate : {
      fontFamily: 'Roboto',
      fontSize: 12,
      textSpacing: 30,
      layout: 1,
      horizontalMargin: 8,
      verticleMargin: 8
    }
};


export function reducer(state = initialState, action: Action): State {
  switch (action.type) {   
   case CoverLetterActionTypes.updateCoverLetter:
    return { ...state, coverLetter: (action as any).data } as State;
   case CoverLetterActionTypes.updateCoverLetterTemplate:
    return { ...state, coverLetterTemplate : (action as any).data } as State;
  case CoverLetterActionTypes.resetCoverLetter:
    return { ...initialState } as State;
    default:
      return state;
  }
}
