import { updateCoverLetter } from './../../../shared/actions/cover-letter.actions';
import { Component, OnInit } from '@angular/core';
import * as fromCoverLetter from '../../../shared/reducers/cover-letter.reducer';
import { Store } from '@ngrx/store';
import { CoverLetter, CoverLetterTemplate } from '../../models/cover-letter';
import { CoverLetterSharedService } from '../../services/cover-letter-shared.service';
import { AppUser } from 'src/app/modules/shared/models/AppUser';
import { AuthService } from 'src/app/modules/shared/services/auth.service';
import { AlertService } from 'src/app/modules/shared/services/alert.service';
import { LoaderService } from 'src/app/modules/shared/services/loader.service';

import * as jsPDF from 'jspdf';
import html2pdf from 'html2pdf.js';
import html2canvas from 'html2canvas';


@Component({
  selector: 'app-cover-letter-overview',
  templateUrl: './cover-letter-overview.component.html',
  styleUrls: ['./cover-letter-overview.component.scss']
})
export class CoverLetterOverviewComponent implements OnInit {
  coverLetterData: CoverLetter;
  coverLetterTemplate: CoverLetterTemplate = {
    content : {},
    customerId: '',
    id : '',
    name : ''
  };
  userDetails: AppUser;
  constructor(
    private coverLetterStore: Store<fromCoverLetter.State>,
    private coverLetterService: CoverLetterSharedService,
    private authService: AuthService,
    private alertService: AlertService,
    private loaderSrevice: LoaderService
  ) { }

  ngOnInit() {
    this.authService.currentUser()
    .subscribe(res => this.userDetails = res);

    this.coverLetterStore.select(fromCoverLetter.CoverLetterFeatureKey)
      .subscribe(res => {
        this.coverLetterTemplate.content = JSON.parse(JSON.stringify((res as any).coverLetterTemplate));
        this.coverLetterData = JSON.parse(JSON.stringify((res as any).coverLetter));
      });
  }

  saveCoverLetter() {
    if(this.coverLetterData.name.length == 0) {
      this.alertService.displayAlert('info', 'Please give this Cover Letter a name before saving it');
      return;
    }
    if (this.userDetails) {
      this.loaderSrevice.showLoader();
      
      this.coverLetterService.saveCoverLetterTemplate(this.coverLetterData,this.coverLetterTemplate.content,this.userDetails.id)
        .subscribe(res => {
          this.coverLetterData.coverLetterTemplateId = res.coverLetterTemplate.id;
          this.coverLetterData.customerId = this.userDetails.id;
          this.coverLetterData.type = 'paper';
          this.coverLetterService.createNewCoverLetter(this.coverLetterData)
            .subscribe(res => {
              let updatedContent = JSON.parse(JSON.stringify(this.coverLetterData));
              updatedContent['id'] = res.coverLetter.id;
              this.coverLetterStore.dispatch(updateCoverLetter({ data: updatedContent }));
              this.loaderSrevice.stopLoader();
              this.alertService.displayAlert('success', 'Your Cover Letter is saved successfully.')
            }, error => {
              this.loaderSrevice.stopLoader();
              this.alertService.defaultError();
            });
        }, error => {
              this.loaderSrevice.stopLoader();
              this.alertService.defaultError();
        });
    } else {
      this.alertService.displayAlert('info', 'Login now or register to save your Cover Letter.')
    }
      
  }

  download(){
    var data = document.getElementById('box');
    html2canvas(data, { scale: 5 }).then(canvas => {

      var imgData = canvas.toDataURL('image/JPEG');
      var imgWidth = 210;
      var pageHeight = 297;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      var heightLeft = imgHeight;

      var doc = new jsPDF('p', 'mm', "a4");
      var position = 1;

      doc.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, 'FAST');
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        doc.addPage();

        doc.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, 'FAST');
        heightLeft -= pageHeight;
      }
      doc.save("cover-letter.pdf");

    })
  }

}
