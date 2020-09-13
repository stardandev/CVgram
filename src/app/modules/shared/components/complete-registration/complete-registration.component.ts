import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AuthService } from '../../services/auth.service';
import * as fromGlobalStore from '../../reducers/global-config.reducer';
import { Store, State } from '@ngrx/store';
import { AlertService } from '../../services/alert.service';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-complete-registration',
  templateUrl: './complete-registration.component.html',
  styleUrls: ['./complete-registration.component.scss']
})
export class CompleteRegistrationComponent implements OnInit {
  public currentLanguage: string = '';
  registrationForm: FormGroup;
  showLoader: boolean;
  constructor(
    public dialogRef: MatDialogRef<CompleteRegistrationComponent>,
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
    this._createRegistrationForm();
  }

  closeModal() {
    this.dialogRef.close();
  }

  _createRegistrationForm() {
    this.registrationForm = new FormGroup({
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
    if (this.registrationForm) {
      return fieldControl.value === this.registrationForm.get("password").value ? null : {
        NotEqual: true
      };
    } else {
      return null;
    }
  }

  completeRegistration() {
    this.showLoader = true;
    this.authService.completeRegistration({
      key : this.formData,
      password : this.registrationForm.get('password').value
    })
      .subscribe(res => {
        this.showLoader = false;
        // this.globalStore.dispatch(startUserSession({data : res.customer}));
        this.closeModal();
        this.alertService.displayAlert('success',
        this.currentLanguage == 'fr' ? "Vous êtes enregistré avec succès, vous pouvez maintenant vous connecter en utilisant votre e-mail et votre mot de passe." : "You are registered successfully, You can now log in using your email and password."
        , 5000);
      },error => {
        this.currentLanguage == 'fr' ? this.alertService.defaultFrError() : this.alertService.defaultError();
        this.showLoader = false;
      });
    
  }


}
