import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmailServiceService } from 'src/app/modules/shared/services/email-service.service';
import { AuthService } from 'src/app/modules/shared/services/auth.service';
import { LoaderService } from 'src/app/modules/shared/services/loader.service';
import { AlertService } from 'src/app/modules/shared/services/alert.service';

@Component({
  selector: 'app-email-view',
  templateUrl: './email-view.component.html',
  styleUrls: ['./email-view.component.scss']
})
export class EmailViewComponent implements OnInit{

  availableEmails:any[] = [];

  constructor(
    private router: Router,
    private emailService: EmailServiceService,
    private authService: AuthService,
    private loaderService: LoaderService,
    private alertService: AlertService
    ) { }

    ngOnInit() {

      this.authService.currentUser().subscribe(res => {
        if(res) {
            this.loaderService.showLoader();
            this.getAvailableEmailLetters();
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

  createNewEmail() {
    this.router.navigate(['/dashboard/email-operations'])
  }

  getAvailableEmailLetters() {
    this.emailService.getAllEmails()
      .subscribe(res => {
        this.availableEmails = res.coverLetters;
        this.loaderService.stopLoader();
      }, error => {
        this.loaderService.stopLoader();
      })
  }

  deleteEmail(item) {
    this.loaderService.showLoader();
    this.emailService.deleteEmail(item)
    .subscribe(res => {
      this.getAvailableEmailLetters();
    }, error => {
      this.loaderService.stopLoader();
    })
  }

  openEmail(item) {
    this.router.navigate(['/dashboard/email-operations'], { queryParams: { id: item.id }});
  }

}
