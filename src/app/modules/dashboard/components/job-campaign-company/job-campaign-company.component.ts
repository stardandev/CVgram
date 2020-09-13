import { Component, OnInit } from '@angular/core';
import { JobSearchLead, JobSearchModel, CompanyModel } from 'src/app/modules/shared/models/JosSearch.model';
import { JobService } from 'src/app/modules/shared/services/jobSearch.service';
import { StorageService } from 'src/app/modules/shared/services/storage.service';
import { AuthService } from 'src/app/modules/shared/services/auth.service';
import { MatDialog } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService } from 'src/app/modules/shared/services/alert.service';
import { AddElementDialogComponent } from './add-element-dialog/add-element-dialog.component';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CompanyProspectDialogComponent } from './company-prospect-dialog/company-prospect-dialog.component';

@Component({
  selector: 'app-job-campaign-company',
  templateUrl: './job-campaign-company.component.html',
  styleUrls: ['./job-campaign-company.component.scss']
})
export class JobCampaignCompanyComponent implements OnInit {

  jobLeadList: Array<JobSearchLead> = [];
  currentJob: JobSearchModel = {} as JobSearchModel;
  sub: any;

  interestList: Array<JobSearchLead> = [];
  contactTaKenList: Array<JobSearchLead> = [];
  interviewList: Array<JobSearchLead> = [];
  finalizeList: Array<JobSearchLead> = [];
  constructor(
    private _dialog: MatDialog, private alertService: AlertService,
    private authService: AuthService,
    private _jobServ: JobService, private storageServ: StorageService,
    private route:ActivatedRoute
  ) { }

  ngOnDestroy = () => this.sub.unsubscribe();

  ngOnInit() {
    this.sub = this.storageServ.getCurrentJob().subscribe(res => this.currentJob = res);
    this.route.queryParams.subscribe(res => {
      if(!this.currentJob.id && res.jobSearchId)
       this.currentJob.id = res.jobSearchId;

       this.getJobLeads();
    })
  }

  getJobLeads() {
    this._jobServ.getJobLeads(this.currentJob.id).subscribe(res => {
      this.jobLeadList = res;
      console.log(res);
      this.setCategoryList();
    })
  }

  setCategoryList() {
    this.interestList = this.createDragableArray("interested");
    this.contactTaKenList = this.createDragableArray("contact taken");
    this.interviewList = this.createDragableArray("interview process");
    this.finalizeList = this.createDragableArray("finalizing");
  }

  addNewElementDialog(elementType) {
    var title = elementType ? 'Add New Prospect' : 'Add Element'
    const dialogRef = this._dialog.open(AddElementDialogComponent, {
      disableClose: true,
      width: '530px',
      data: { isNewElement: elementType, title: title }
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        let jobSearchLead: JobSearchLead = {} as JobSearchLead;

        jobSearchLead.name = res.value.companyName;
        jobSearchLead.createdAt = new Date();
        jobSearchLead.category = "interested";

        this._jobServ.createJobSearchLead(jobSearchLead, this.currentJob.id).subscribe(res => {
          this.jobLeadList.push(res.jobSearchLead)
          this.setCategoryList();
        })
        this.alertService.displayAlert('success', 'Your job lead is created successfully.')
      }
    });
  }
  drop(event: CdkDragDrop<any[]>, type) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
    event.container.data[event.currentIndex].category = type;
    this._jobServ.updateJobSearchLead(event.container.data[event.currentIndex]).subscribe(res => {
      console.log(res);
    })
  }


  createDragableArray(category) {
    let arr = [], i = 0;
    let len = this.jobLeadList.length;

    if (len > 0) {
      while (i < len) {
        if (this.jobLeadList[i].category.toUpperCase() == category.toUpperCase()) {
          arr.push(this.jobLeadList[i]);
        }
        i++;
      }
    }
    return arr;
  }

  openLeadAction(company){

    const dialogRef = this._dialog.open(CompanyProspectDialogComponent, {
      disableClose: true,
      width: '530px',
      data: { isNewElement: false, company: company }
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        let jobSearchLead: JobSearchLead = {} as JobSearchLead;

        jobSearchLead.name = res.value.companyName;
        jobSearchLead.createdAt = new Date();
        jobSearchLead.category = "interested";

        this._jobServ.createJobSearchLead(jobSearchLead, this.currentJob.id).subscribe(res => {
          this.jobLeadList.push(res.jobSearchLead)
          this.setCategoryList();
        })
        this.alertService.displayAlert('success', 'Your job lead is created successfully.')
      }
    });
  }

}
