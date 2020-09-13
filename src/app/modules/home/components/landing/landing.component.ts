import { updateUserRegistrationKey, updateUserResetPasswordData } from './../../../shared/actions/global-configs.actions';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as fromGlobalStore from '../../../shared/reducers/global-config.reducer';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material';
import { CompleteRegistrationComponent } from 'src/app/modules/shared/components/complete-registration/complete-registration.component';
import { CompletePasswordResetComponent } from 'src/app/modules/shared/components/complete-password-reset/complete-password-reset.component';
@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

  slides = [
    { img: "../../../../assets/Landing/resume1.jpg" },
    { img: "../../../../assets/Landing/resume2.jpg" },
    { img: "../../../../assets/Landing/resume3.jpg" },
    { img: "../../../../assets/Landing/resume4.jpg" },
    { img: "../../../../assets/Landing/resume5.jpg" },
    { img: "../../../../assets/Landing/resume6.jpg" }
  ];
  slideConfig = {
    "slidesToShow": 4, "slidesToScroll": 3, "autoplay": true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ]


  };

  constructor(
    private router: Router,
    private globalStore: Store<fromGlobalStore.State>,
    private _dialog: MatDialog
  ) { }

  ngOnInit() {
    let selector = fromGlobalStore.globalConfigFeatureKey as any;
    this.globalStore.select(selector)
      .subscribe(res => {
        if (res.userRegistrationKey) {
          this._dialog.open(CompleteRegistrationComponent, {
            disableClose: true,
            data: res.userRegistrationKey
          });
          this.globalStore.dispatch(updateUserRegistrationKey({ key: '' }))
        }
        if (res.userPasswordResetData) {
          this._dialog.open(CompletePasswordResetComponent, {
            disableClose: true,
            data: res.userPasswordResetData
          });
          this.globalStore.dispatch(updateUserResetPasswordData(null));
        }
      })
  }

  navigateToDashboard() {
    this.router.navigate(['/dashboard']);
  }

}
