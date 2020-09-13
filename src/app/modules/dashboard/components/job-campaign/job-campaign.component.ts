import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { NewJobDialogueComponent } from '../new-job-dialogue/new-job-dialogue.component';
import { JobSearchModel } from 'src/app/modules/shared/models/JosSearch.model';
import { JobService } from 'src/app/modules/shared/services/jobSearch.service';
import { AuthService } from 'src/app/modules/shared/services/auth.service';
import { AppUser } from 'src/app/modules/shared/models/AppUser';
import { AlertService } from 'src/app/modules/shared/services/alert.service';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/modules/shared/services/storage.service';

@Component({
  selector: 'app-job-campaign',
  templateUrl: './job-campaign.component.html',
  styleUrls: ['./job-campaign.component.scss']
})
export class JobCampaignComponent implements OnInit {

  private userDetails: AppUser;
  jobSearchList: Array<JobSearchModel> = [];

  constructor(
    private _dialog: MatDialog, private alertService: AlertService, private router: Router,
    private StorageServ: StorageService, private _jobServ: JobService, private authService: AuthService
  ) { }

  ngOnInit() {
    $(function () {
      $(".table-wrap").each(function () {
        var nmtTable = $(this);
        var nmtHeadRow = nmtTable.find("thead tr");
        nmtTable.find("tbody tr").each(function () {
          var curRow = $(this);
          for (var i = 0; i < curRow.find("td").length; i++) {
            var rowSelector = "td:eq(" + i + ")";
            var headSelector = "th:eq(" + i + ")";
            curRow.find(rowSelector).attr('data-title', nmtHeadRow.find(headSelector).text());
          }
        });
      });
    });

    this.authService.currentUser().subscribe(res => {
      this.userDetails = res
      this.getAllJobsList();
    });

  }

  deleteJob(jobModel: JobSearchModel, i: number) {
    this._jobServ.deleteJob(jobModel.id).subscribe(res => {
      this.jobSearchList.splice(i, 1);
      this.alertService.displayAlert('warning', 'Job search deleted')
    })
  }
  getAllJobsList() {
    this._jobServ.getJobList().subscribe(res => {
      this.jobSearchList = res;
    })
  }
  addJobLog() {
    const dialogRef = this._dialog.open(NewJobDialogueComponent, {
      disableClose: true,
      width: '530px'
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        if (this.userDetails) {
          let jobSrch: JobSearchModel = {} as JobSearchModel;
          jobSrch.name = res.value.name;
          jobSrch.startedAt = new Date();
          jobSrch.endedAt = new Date();
          jobSrch.customerId = this.userDetails.id;
          jobSrch.description = res.value.description;
          this._jobServ.createJobSearch(jobSrch).subscribe(res => {
            this.jobSearchList.push(res.jobSearch);
            this.alertService.displayAlert('success', 'Your JOB search is saved successfully.');
          });
        } else {
          this.alertService.displayAlert('info', 'Login now or register to save your JOB search.')
        }
      }
    });
  }

  openJob(job: JobSearchModel) {
    this.StorageServ.setCurrentJob(job);
    this.router.navigate(['/dashboard/job-search-logbook/Job-Company'], {
      queryParams: {
        jobSearchId : job.id
      }
    });
  }
}
