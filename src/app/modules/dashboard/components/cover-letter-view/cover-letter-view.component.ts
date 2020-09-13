import { updateCoverLetter, updateCoverLetterTemplate, resetCoverLetter } from './../../../shared/actions/cover-letter.actions';
import { CoverLetter } from './../../models/cover-letter';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/modules/shared/services/auth.service';
import { LoaderService } from 'src/app/modules/shared/services/loader.service';
import { CoverLetterSharedService } from '../../services/cover-letter-shared.service';
import { AlertService } from 'src/app/modules/shared/services/alert.service';
import { Store } from '@ngrx/store';
import * as fromCoverLetter from '../../../shared/reducers/cover-letter.reducer';

@Component({
  selector: 'app-cover-letter-view',
  templateUrl: './cover-letter-view.component.html',
  styleUrls: ['./cover-letter-view.component.scss']
})
export class CoverLetterViewComponent implements OnInit {

  availableCoverLetters: CoverLetter[] = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private loaderService: LoaderService,
    private coverLetterService: CoverLetterSharedService,
    private alertService: AlertService,
    private coverLetterStore: Store<fromCoverLetter.State>,
    ) { }

  ngOnInit() {

    this.authService.currentUser().subscribe(res => {
      if(res) {
          this.loaderService.showLoader();
          this.getAvailableCoverLetters();
      }
    })

    $(function() {
      $(".table-wrap").each(function() {
        var nmtTable = $(this);
        var nmtHeadRow = nmtTable.find("thead tr");
        nmtTable.find("tbody tr").each(function() {
          var curRow = $(this);
          for (var i = 0; i < curRow.find("td").length; i++) {
            var rowSelector = "td:eq(" + i + ")";
            var headSelector = "th:eq(" + i + ")";
            curRow.find(rowSelector).attr('data-title', nmtHeadRow.find(headSelector).text());
          }
        });
      });
    });
  }

  getAvailableCoverLetters() {
    this.coverLetterService.getAvailableCoverLetters()
      .subscribe(res => {
        this.availableCoverLetters = res.coverLetters;
        this.loaderService.stopLoader();
      }, error => {
        this.alertService.defaultError();
        this.loaderService.stopLoader();
      });
  }

  openCoverLetter(item) {
    this.loaderService.showLoader();
    this.coverLetterService.getCoverLetterTemplate(item.coverLetterTemplateId)
    .subscribe(res => {
      this.coverLetterStore.dispatch(updateCoverLetterTemplate({data :res.coverLetterTemplate.content}))
      this.coverLetterStore.dispatch(updateCoverLetter({data: item}));
      this.loaderService.stopLoader();
      this.router.navigate(['/dashboard/cover-letter-operations']);
    }, error => {
      this.alertService.defaultError();
      this.loaderService.stopLoader();
    });
  }

  deleteCoverLetter(item) {
    this.coverLetterService.deleteCoverLetter(item)
      .subscribe(res => {
        this.getAvailableCoverLetters();
      });
  }

  createNewCoverLetter() {
    this.coverLetterStore.dispatch(resetCoverLetter({}));
    this.router.navigate(['/dashboard/cover-letter-operations'])
  }

}
