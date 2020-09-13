import { UserDetailsFeatureKey } from './../reducers/user-details.reducer';
import { Injectable } from '@angular/core';
import { AjaxService } from './ajax.service';
import * as fromUserDetailsStore from '../reducers/user-details.reducer';
import { BehaviorSubject } from 'rxjs';
import { AppUser } from '../models/AppUser';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  currentUserDetails = new BehaviorSubject<AppUser>(null);

  constructor(
    private ajaxService: AjaxService,
    private userDetailsStore: Store<fromUserDetailsStore.State>
    ) {
    let userDetailsStoreSelector = fromUserDetailsStore.UserDetailsFeatureKey as any;
    this.userDetailsStore.select(userDetailsStoreSelector).subscribe(res => {
      this.currentUserDetails.next(JSON.parse(JSON.stringify(res.user)));
    });
   }

  logIn(data) {
      return this.ajaxService.logIn(data);
  }

  logOut() {
    return this.ajaxService.logOut();
  }

  signUp(data) {
    return this.ajaxService.signUp(data);
  }

  completeRegistration(data) {
    return this.ajaxService.completeRegistration(data);
  }

  requestPasswordResetLink(email) {
    return this.ajaxService.requestPasswordResetLink(email);
  }

  completePasswordReset(data) {
    return this.ajaxService.completePasswordReset(data);
  }

  currentUser() {
    return this.currentUserDetails.asObservable();
  }
}
