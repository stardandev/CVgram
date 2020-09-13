import { updateUserRegistrationKey } from './../../actions/global-configs.actions';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as fromGlobalStore from '../../reducers/global-config.reducer';
import { Store } from '@ngrx/store';
@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private globalStore: Store<fromGlobalStore.State>
  ) { }

  ngOnInit() {
    let key = this.route.snapshot.params.key;
    this.globalStore.dispatch(updateUserRegistrationKey({key : key}));
    this.router.navigate(['/landing'])
  }

}
