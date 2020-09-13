
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Store } from '@ngrx/store';
import * as fromGlobalStore from '../../reducers/global-config.reducer';
import * as fromUserDetailsStore from '../../reducers/user-details.reducer';
import { AlertService } from '../../services/alert.service';
import { StorageService } from '../../services/storage.service';
import { SignupComponent } from '../signup/signup.component';
import { ForgotpasswordComponent } from '../forgotpassword/forgotpassword.component';
import { startUserSession } from '../../actions/user-details.actions';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public currentLanguage: string = '';
  userSigninForm: FormGroup;
  emailPattern: RegExp = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{1,4}$/;
  showLoader:boolean;

  constructor(
    public dialogRef: MatDialogRef<LoginComponent>,
    @Inject(MAT_DIALOG_DATA) public formData,
    private authService: AuthService,
    private userDetailsStore: Store<fromUserDetailsStore.State>,
    private alertService: AlertService,
    private _storage: StorageService,
    private _dialog : MatDialog
  ) {
    this._storage.getCurrentLanguage()
    .subscribe(res => {
      this.currentLanguage = res;
    });
  }

  ngOnInit() {
    this._createSigninForm();
  }

  closeModal() {
    this.dialogRef.close();
  }


  _createSigninForm() {
    this.userSigninForm = new FormGroup({
      email: new FormControl('', {
        validators: [
          Validators.required,
          Validators.pattern(this.emailPattern)
        ]
      }),
      password: new FormControl('', [
        Validators.required
      ]),
      type: new FormControl('customer')
    });
  }

  onLoginSubmit() {
    this.showLoader = true;
    this.authService.logIn(this.userSigninForm.value)
      .subscribe(res => {
        this.userDetailsStore.dispatch(startUserSession({ data: res.body.user }));
        this.dialogRef.close(res);
        this.showLoader = false;
      }, error => {
        this.showLoader = false;
        if(error.error.error) {
          this.alertService.displayAlert('error', error.error.error);
        }else {
          this.currentLanguage == 'fr' ? this.alertService.defaultFrError() : this.alertService.defaultError();
        }
        console.log(error)
      });
  }
  
  navigateToSignup() {
    this.dialogRef.close();
    const dialogRef =	this._dialog.open(SignupComponent, {
			disableClose: true,
			data: null
		});
		dialogRef.afterClosed().subscribe((res) => {
			if (res) {
			}
		});
  }

  navigateTOForgotPassword() {
    this.dialogRef.close();
    const dialogRef =	this._dialog.open(ForgotpasswordComponent, {
			disableClose: true,
			data: null
		});
		dialogRef.afterClosed().subscribe((res) => {
			if (res) {
        
			}
		});
  }
}
