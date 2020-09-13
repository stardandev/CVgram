import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Store } from '@ngrx/store';
import * as fromGlobalStore from '../../reducers/global-config.reducer';
import { AlertService } from '../../services/alert.service';
import { StorageService } from '../../services/storage.service';
import { SignupComponent } from '../signup/signup.component';
const LINK_SENT_EN_MESSAGE = 'We have sent you a link to reset your password.';
const LINK_SENT_FR_MESSAGE = 'Nous vous avons envoyé un lien pour réinitialiser votre mot de passe.';
@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.scss']
})
export class ForgotpasswordComponent implements OnInit {

  public currentLanguage: string = '';
  forgotPasswordForm: FormGroup;
  emailPattern: RegExp = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{1,4}$/;


  constructor(
    public dialogRef: MatDialogRef<ForgotpasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public formData,
    private authService: AuthService,
    private globalStore: Store<fromGlobalStore.State>,
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
    this._createForgotPasswordForm();
  }

  closeModal() {
    this.dialogRef.close();
  }


  _createForgotPasswordForm() {
    this.forgotPasswordForm = new FormGroup({
      email: new FormControl('', {
        validators: [
          Validators.required,
          Validators.pattern(this.emailPattern)
        ]
      })
    });
  }

  onSubmit() {
    this.authService.requestPasswordResetLink(this.forgotPasswordForm.get('email').value)
      .subscribe(res => {
        this.dialogRef.close();
        this.alertService.displayAlert('success',
        this.currentLanguage == 'fr' ? LINK_SENT_FR_MESSAGE : LINK_SENT_EN_MESSAGE
        )
      }, error => {
        if(error.error.error) {
          this.alertService.displayAlert('error', error.error.error);
        }else {
          this.currentLanguage == 'fr' ? this.alertService.defaultFrError() : this.alertService.defaultError();
        }
        console.log(error)
      });
  }
  

}
