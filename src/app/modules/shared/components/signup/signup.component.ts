import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { AlertService } from '../../services/alert.service';
import { StorageService } from '../../services/storage.service';
import { LoginComponent } from '../login/login.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  showLoader: boolean;
  userSignupForm: FormGroup;
  public currentLanguage: string = '';
  emailPattern: RegExp = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{1,4}$/;
  constructor(
    public dialogRef: MatDialogRef<SignupComponent>,
    @Inject(MAT_DIALOG_DATA) public formData,
    private authService: AuthService,
    private alertService: AlertService,
    private _storage: StorageService,
    private _dialog: MatDialog,
    private router: Router
  ) {
    this._storage.getCurrentLanguage()
      .subscribe(res => {
        this.currentLanguage = res;
      });
  }

  ngOnInit() {
    this._createSignupForm();
  }

  closeModal() {
    this.dialogRef.close();
  }

  _createSignupForm() {
    this.userSignupForm = new FormGroup({
      email: new FormControl('', {
        validators: [
          Validators.required,
          Validators.pattern(this.emailPattern)
        ]
      }),
      password: new FormControl('', {
        validators: [
          Validators.required
        ]
      })
    },
    );
  }

  signUp() {
    this.showLoader = true;
    this.authService.signUp({
      email: this.userSignupForm.controls.email.value,
      password: this.userSignupForm.controls.password.value
    })
      .subscribe(res => {
        this.showLoader = false;
        this.closeModal();
        this.alertService.displayAlert('success',
          this.currentLanguage == 'fr' ? "Veuillez vérifier votre e-mail, nous avons envoyé le lien pour terminer l'inscription" : "Please check your email, We have sent the link to complete the registration"
          , 5000);
      }, error => {
        this.showLoader = false;
        this.alertService.displayAlert('error',
        this.currentLanguage == 'fr' ? `${this.userSignupForm.controls.email.value} est déjà enregistré chez nous` : `${this.userSignupForm.controls.email.value} is already registered with us`
        , 4000)
      })
  }

  navigateToLogin() {
    this.dialogRef.close();
    const dialogRef =	this._dialog.open(LoginComponent, {
			disableClose: true,
			data: null
		});
		dialogRef.afterClosed().subscribe((res) => {
			if (res) {
					this.router.navigate(['/dashboard/cv']);
			}
		});
  }

}
