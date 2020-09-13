import { resetuserContent } from './../../../shared/actions/user-content.actions';
import { updateUserContent } from 'src/app/modules/shared/actions/user-content.actions';
import { ResumePageBounds } from 'src/app/modules/shared/models/user-content-representation';
import { UserContent } from './../../../shared/models/user-content';
import { updateResumePageBounds, resetGlobalConfig } from './../../../shared/actions/global-configs.actions';
import { Component, OnInit } from '@angular/core';
import { Route } from '@angular/compiler/src/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/modules/shared/services/auth.service';
import { ResumeService } from 'src/app/modules/shared/services/resume.service';
import { ResumeStructureBuilder } from 'src/app/modules/shared/Utils/resumeStructureBuilder';
import { Store } from '@ngrx/store';
import * as fromUserContent from '../../../shared/reducers/user-content.reducer';
import * as fromGlobalStore from '../../../shared/reducers/global-config.reducer';
import { LoaderService } from 'src/app/modules/shared/services/loader.service';
import { AlertService } from 'src/app/modules/shared/services/alert.service';
import { AppUser } from 'src/app/modules/shared/models/AppUser';
import { MatDialog } from '@angular/material';
import { NewResumePromptComponent } from 'src/app/modules/shared/components/new-resume-prompt/new-resume-prompt.component';

@Component({
  selector: 'app-resume-view',
  templateUrl: './resume-view.component.html',
  styleUrls: ['./resume-view.component.scss']
})
export class ResumeViewComponent implements OnInit {

  availableResumes:any[] = [];
  userContent: UserContent;
  resumePageBounds: ResumePageBounds;
  userDetails: AppUser;

  constructor(
    private router : Router,
    private authService: AuthService,
    private resumeService: ResumeService,
    private userContentStore: Store<fromUserContent.State>,
    private globalStore: Store<fromGlobalStore.State>,
    private loaderService: LoaderService,
    private alertService: AlertService,
    private _dialog: MatDialog
  ) { 
    let selectore = fromGlobalStore.globalConfigFeatureKey as any;
    let userContentSelector = fromUserContent.UserContentFeatureKey as any;
    this.userContentStore.select(userContentSelector)
      .subscribe(res => {
        this.userContent = res.content;
      })
    this.globalStore.select(selectore)
      .subscribe(res => {
        this.resumePageBounds = res.resumePageBounds;
      });

      this.authService.currentUser()
      .subscribe(res => {
        this.userDetails = res;
        if(this.userDetails) {
          this.loaderService.showLoader();
          this.getAvailableResumes();
      }
      });
  }

  ngOnInit() {
      if(this.userDetails) {
          this.loaderService.showLoader();
          this.getAvailableResumes();
      }
   
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

  createNewResume() {
    if(this.availableResumes && this.availableResumes.length > 0) {
      const dialogRef = this._dialog.open(NewResumePromptComponent, {
        disableClose: true,
        width: '530px',
        data : this.availableResumes
      });
  
      dialogRef.afterClosed().subscribe((resume) => {
        switch (resume.selectionType) {
            case 1:
              this.userContentStore.dispatch(resetuserContent({}));
              this.globalStore.dispatch(resetGlobalConfig({}));
              this.router.navigate(['/dashboard/resume-operations'])
            break;
            case 2:
              this.loaderService.showLoader();
              this.resumeService.getTemplate(resume.data.cvTemplateId)
              .subscribe(res => {
                let data = res.cvTemplate.content;
                data['tempalteName'] = res.cvTemplate.name;
                this.globalStore.dispatch(updateResumePageBounds({data  : data}));
                let userContent = ResumeStructureBuilder.createUserContentStructure(resume.data);
                delete userContent.id;
                this.userContentStore.dispatch(updateUserContent(
                  { data: userContent }
                ));
                this.loaderService.stopLoader();
                this.router.navigate(['/dashboard/resume-operations']);
              })
            break;
        }
      });
    }else {
      this.router.navigate(['/dashboard/resume-operations'])
    }
  }

  openResume(resume) {
    this.loaderService.showLoader();
    this.resumeService.getTemplate(resume.cvTemplateId)
      .subscribe(res => {
        let data = res.cvTemplate.content;
        data['templateId'] = res.cvTemplate.id;
        data['tempalteName'] = res.cvTemplate.name;
        this.globalStore.dispatch(updateResumePageBounds({data  : data}));
        let userContent = ResumeStructureBuilder.createUserContentStructure(resume);
        this.userContentStore.dispatch(updateUserContent(
          { data: userContent }
        ));
        this.loaderService.stopLoader();
        this.router.navigate(['/dashboard/resume-operations']);
      }, error => {
        this.alertService.defaultError();
        this.loaderService.stopLoader();
      });
  }

  deleteResume(resume) {
      this.resumeService.deleteResume(resume.id)
          .subscribe(res => {
            this.globalStore.dispatch(resetGlobalConfig({}));
            this.userContentStore.dispatch(resetuserContent({}));
              this.getAvailableResumes();
            });
            
  }
  
  getAvailableResumes() {
    this.resumeService.getAvailableResumes()
    .subscribe(res => {
      this.availableResumes = res.cvs;
      this.loaderService.stopLoader();
    }, error => {
      this.alertService.defaultError();
      this.loaderService.stopLoader();
    })
  }

}
