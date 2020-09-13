import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { JobSearchLead, JobSearchLeadActionModel } from 'src/app/modules/shared/models/JosSearch.model';
import { JobService } from 'src/app/modules/shared/services/jobSearch.service';
import { AddElementDialogComponent } from '../add-element-dialog/add-element-dialog.component';

@Component({
  selector: 'app-company-prospect-dialog',
  templateUrl: './company-prospect-dialog.component.html',
  styleUrls: ['./company-prospect-dialog.component.scss']
})
export class CompanyProspectDialogComponent implements OnInit {
  isNewElement: boolean;
  jobSearchLead: JobSearchLead = {} as JobSearchLead;

  jobLeadList: Array<JobSearchLeadActionModel> = [];
  constructor(
    private _dialog: MatDialog,
    private jobServ: JobService,
    public dialogRef: MatDialogRef<CompanyProspectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.isNewElement = data.isNewElement;
    this.jobSearchLead = data.company;
  }

  ngOnInit() {
    this.jobServ.getJobSearchLeadActionList(this.jobSearchLead.jobSearchId,this.jobSearchLead.id).subscribe(res => this.jobLeadList = res);
  }

  closeModal() {
    this.dialogRef.close();
  }
  addElement() {
    const dialogRef = this._dialog.open(AddElementDialogComponent, {
      disableClose: true,
      width: '530px',
      data: { isNewElement: false, title: 'Add Element' }
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        let jobLeadAction: JobSearchLeadActionModel = {} as JobSearchLeadActionModel;

        jobLeadAction.createdAt = new Date();
        jobLeadAction.description = res.value.eventDescription;
        jobLeadAction.nextAction = res.value.followUpAction;

        this.jobServ.createJobSearchLeadActions(jobLeadAction,this.jobSearchLead.jobSearchId,this.jobSearchLead.id).subscribe(result=>{
          this.jobLeadList.push(result.jobSearchLeadAction);
        })
      }
    });
  }
}
