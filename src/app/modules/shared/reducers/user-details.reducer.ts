import { UserDetailsActionTypes } from './../actions/user-details.actions';
import { Action } from '@ngrx/store';
import { AppUser } from '../models/AppUser';


export const UserDetailsFeatureKey = 'userDetails';

export interface State {
    user: AppUser;
}

export const initialState: State = {
    user: null
};


export function reducer(state = initialState, action: Action): State {
  switch (action.type) {    case UserDetailsActionTypes.startUserSession:
    return { ...state, user: (action as any).data } as State;
  case UserDetailsActionTypes.deleteUserSession:
    return {...state, user : null} as State;
    default:
      return state;
  }
}
