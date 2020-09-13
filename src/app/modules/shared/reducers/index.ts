import { environment } from 'src/environments/environment';
import {
  ActionReducerMap,
  MetaReducer
} from '@ngrx/store';

import * as fromGlobalConfig from './global-config.reducer';
import * as fromUserContent from './user-content.reducer';
import * as fromUserDetails from './user-details.reducer';
import * as fromCoverLetter from './cover-letter.reducer'

export interface State {
  [fromGlobalConfig.globalConfigFeatureKey]: fromGlobalConfig.State;
  [fromUserContent.UserContentFeatureKey]: fromUserContent.State;
  [fromUserDetails.UserDetailsFeatureKey]: fromUserDetails.State;
  [fromCoverLetter.CoverLetterFeatureKey]: fromCoverLetter.State;
}

// @ts-ignore
export const reducers: ActionReducerMap<State> = {};
reducers[fromGlobalConfig.globalConfigFeatureKey] = fromGlobalConfig.reducer;
reducers[fromUserContent.UserContentFeatureKey] = fromUserContent.reducer;
reducers[fromUserDetails.UserDetailsFeatureKey] = fromUserDetails.reducer;
reducers[fromCoverLetter.CoverLetterFeatureKey] = fromCoverLetter.reducer;
// };


export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
