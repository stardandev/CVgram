import {  updateUserResetPasswordData } from './../../actions/global-configs.actions';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as fromGlobalStore from '../../reducers/global-config.reducer';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private globalStore: Store<fromGlobalStore.State>
    ) { }

  ngOnInit() {
    let key = this.route.snapshot.params.key;
    let userId = this.route.snapshot.params.userId;
    this.globalStore.dispatch(updateUserResetPasswordData({data : {
      key : key, 
      userId : userId
    }}));
    this.router.navigate(['/landing'])
  }

}
