import { Component, OnInit } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';
import { AlertService } from 'src/app/modules/shared/services/alert.service';
import { AppUser } from 'src/app/modules/shared/models/AppUser';
import { LoaderService } from 'src/app/modules/shared/services/loader.service';
import { AuthService } from 'src/app/modules/shared/services/auth.service';
import { EmailServiceService } from 'src/app/modules/shared/services/email-service.service';
import { ActivatedRoute } from '@angular/router';
interface IEmailLetter {
  header: any;
  body: any;
  footer: any;
  name: string;
  id? : string;
}
@Component({
  selector: 'app-email-operations',
  templateUrl: './email-operations.component.html',
  styleUrls: ['./email-operations.component.scss']
})
export class EmailOperationsComponent {

  emailLetter: IEmailLetter = {} as IEmailLetter;
  userDetails: AppUser;
  constructor(
    private clipboard: ClipboardService,
    private authService: AuthService,
    private alertService: AlertService,
    private loaderSrevice: LoaderService,
    private emailService: EmailServiceService,
    private route: ActivatedRoute
    ) { 
      this.authService.currentUser()
      .subscribe(res => this.userDetails = res);
      this.route.queryParams.subscribe(res => {
        if(res.id) {
          this.loaderSrevice.showLoader();
          this.emailService.getEmail(res.id)
            .subscribe(res => {
              this.emailLetter = res.coverLetter;
              this.loaderSrevice.stopLoader();
            },error => {
              this.loaderSrevice.stopLoader();
            })
        }
      })
    }

  copyToClipboard() {
    let txt = this.emailLetter.header + "\n\n" + this.emailLetter.body + "\n\n" + this.emailLetter.footer
    this.clipboard.copyFromContent(txt);
    this.alertService.displayAlert('success', 'Coppied to clipboard');
  }

  saveEmailLetter() {
    this.loaderSrevice.showLoader();
    let data = {
      header: this.emailLetter.header,
      body : this.emailLetter.body,
      footer: this.emailLetter.footer,
      name : this.emailLetter.name,
      createdAt : new Date(),
      customerId : this.userDetails.id,
      type : 'electronic',
      id : this.emailLetter.id
    };
    if(data.id) {
      this.emailService.updateEmail(data).subscribe(res => {
        this.emailLetter.id = res.coverLetter.id;
        this.loaderSrevice.stopLoader();
        this.alertService.displayAlert('success', 'Your Email Letter is Updated successfully.')
      }, error => {
        this.alertService.defaultError();
        this.loaderSrevice.stopLoader();
      })
    }else {
      this.emailService.createNewEmail(data).subscribe(res => {
        this.emailLetter.id = res.coverLetter.id;
        this.loaderSrevice.stopLoader();
        this.alertService.displayAlert('success', 'Your Email Letter is saved successfully.')
      }, error => {
        this.alertService.defaultError();
        this.loaderSrevice.stopLoader();
      })
    }

  }
}
