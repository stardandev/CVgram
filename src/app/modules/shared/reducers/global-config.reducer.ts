import { Action } from '@ngrx/store';
import { GlobalConfigsActionTypes } from '../actions/global-configs.actions';
import { UserContentRepresentation, ResumePageBounds } from '../models/user-content-representation';


export const globalConfigFeatureKey = 'globalConfig';

export interface State {
  userContentRepresentation: UserContentRepresentation;
  resumePageBounds: ResumePageBounds;
  userRegistrationKey: string;
  userPasswordResetData: any;
}

export const initialState: State = {
  userContentRepresentation: null,
  userRegistrationKey: '',
  userPasswordResetData : null,
  resumePageBounds: {
    currentHeight : 720,
    headerLayout : 1,
    enablePicture: true,
    enableTitlePrefix: true,
    pictureDisplayStyle: 1,
    columnType: 1,
    image: null,
    dateFormat : {
      yearFormat : 'yyyy',
      monthFormat : 'MM',
      separator: '/'
    },
    fontFamily: 'Roboto',
    displayIcons: true,
    formatting : {
      headerLineSize: 22,
      headerFontSize: 10,
      titleFontSize: 10,
      bodyFontSize: 8,
      borderWidth: 0,
      textSpacing: 21,
      sectionSpacing: 20,
      horizontalMargin: 10,
      verticalMargin: 5,
      sectionLineWidth : 100,
      sectionLineThickness: 2,
      sectionLineAlignment: 'flex-start',
      pageFormat: 'a4'
    },
    columns: {
      leftWidth: 50,
      rightWidth: 50,
      leftBackground: 'white',
      rightBackground: 'white',
      leftFontColor: 'black',
      rightFontColor: 'black'
    },
    colors : {
      headerBackground : 'white',
      headerColor: 'black',
      titleColor: 'black',
      bodyFontColor: 'black',
      borderColor: 'black',
      bodyBackground: 'white',
    },
    sectionOrder: [],
    towColumnsSections: {
      leftColumnOrder: [],
      rightColumnOrder: []
    },
    file : null
  }
};


export function reducer(state = initialState, action: Action): State {
  switch (action.type) {
    case GlobalConfigsActionTypes.UpdateUserContentRepresentation:
      return { ...state, userContentRepresentation: (action as any).userContentRepresentation } as State;
    case GlobalConfigsActionTypes.updateResumePageBounds:
      return {...state, resumePageBounds : (action as any).data} as State;
    case GlobalConfigsActionTypes.updateUserRegistrationKey:
      return {...state, userRegistrationKey : (action as any).key} as State;
    case GlobalConfigsActionTypes.updateUserResetPasswordData:
      return {...state, userPasswordResetData : (action as any).data} as State;
    case GlobalConfigsActionTypes.ResetGlobalConfig:
      return { ...initialState } as State;
    default:
      return state;
  }
}
