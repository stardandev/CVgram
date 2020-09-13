import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AuthService } from '../../services/auth.service';
import { Store } from '@ngrx/store';
import * as fromGlobalStore from '../../reducers/global-config.reducer';
import { AlertService } from '../../services/alert.service';
import { StorageService } from '../../services/storage.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
@Component({
  selector: 'app-complete-password-reset',
  templateUrl: './complete-password-reset.component.html',
  styleUrls: ['./complete-password-reset.component.scss']
})
export class CompletePasswordResetComponent implements OnInit {
  public currentLanguage: string = '';
  passwordResetForm: FormGroup;
  showLoader: boolean;
  constructor(
    public dialogRef: MatDialogRef<CompletePasswordResetComponent>,
    @Inject(MAT_DIALOG_DATA) public formData,
    private authService: AuthService,
    private globalStore: Store<fromGlobalStore.State>,
    private alertService: AlertService,
    private _storage: StorageService
  ) {
    this._storage.getCurrentLanguage()
      .subscribe(res => {
        this.currentLanguage = res;
      });
  }

  ngOnInit() {
    this._createPasswordResetForm();
  }

  closeModal() {
    this.dialogRef.close();
  }

  _createPasswordResetForm() {
    this.passwordResetForm = new FormGroup({
      password: new FormControl('', [
        Validators.required
      ]),
      confirmPassword: new FormControl('', {
        validators: [
          Validators.required,
          this.validateAreEqual.bind(this)
        ]
      })
      },
      );
  }

  validateAreEqual(fieldControl: FormControl) {
    if (this.passwordResetForm) {
      return fieldControl.value === this.passwordResetForm.get("password").value ? null : {
        NotEqual: true
      };
    } else {
      return null;
    }
  }

  completeRegistration() {
    this.showLoader = true;
    this.authService.completePasswordReset({
      type : 'customer',
      id : this.formData.userId,
      key : this.formData.key,
      password : this.passwordResetForm.get('password').value
    })
      .subscribe(res => {
        this.showLoader = false;
        this.closeModal();
        this.alertService.displayAlert('success',
        this.currentLanguage == 'fr' ? "Votre mot de passe a été réinitialisé avec succès" : "Your password has been reseted successfully."
        , 5000);
      },error => {
        this.currentLanguage == 'fr' ? this.alertService.defaultFrError() : this.alertService.defaultError();
        this.showLoader = false;
      });
    
  }

}
