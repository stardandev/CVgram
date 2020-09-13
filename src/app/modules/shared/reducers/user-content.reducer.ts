import { Action } from '@ngrx/store';
import { UserContentActionTypes } from '../actions/user-content.actions';
import { UserContent, ProfessionalExperience } from '../models/user-content';

export const UserContentFeatureKey = 'userContent';

export interface State {
  content: UserContent;
  sectionIdOfOpenAccordion:string;
}

export const initialState: State = {
  content : {
    cvName: "",
    personalDetails : {
      namePrefix : "Mr",
      firstName: "",
      middleName: "",
      lastName: "",
      addressLineOne: "",
      addressLineTwo: "",
      city: "",
      country: "",
      phone: "",
      email: "",
      postalCode: "",
      customSections: []
    },
    profileSummary : {
      sectionType: 'profileSummary',
      displayName: 'Profile',
      frDisplayName: 'Profil',
      content: ''
    },
    professionalExperience : {
      sectionType : 'professionalExperience',
      displayName : 'Professional Experience',
      frDisplayName: 'Expérience professionnelle',
      entries: []
    },
    education: {
      sectionType : 'education',
      displayName: 'Education',
      frDisplayName: 'Éducation',
      entries : []
    },
    language : {
      sectionType : 'language',
      displayName: 'Languages',
      frDisplayName: 'Langages',
      entries : []
    },
    skills : {
      sectionType : 'skills',
      displayName: 'Skills',
      frDisplayName: 'Compétences',
      entries : []
    },
    customSections : []
  },
  sectionIdOfOpenAccordion: ""
};


export function reducer(state = initialState, action: Action): State {
  switch (action.type) {
    case UserContentActionTypes.updateUserContent:
      return { ...state, content: (action as any).data } as State;
      case UserContentActionTypes.resetuserContent:
        return { ...initialState } as State;
    default:
      return state;
  }
}
