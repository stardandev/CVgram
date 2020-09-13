import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../shared/shared.module";
import { DashboardRoutingModule } from "./dashboard-routing.module";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { ResumeViewComponent } from "./components/resume-view/resume-view.component";
import { EmailViewComponent } from "./components/email-view/email-view.component";
import { JobCampaignComponent } from "./components/job-campaign/job-campaign.component";
import { EmailOperationsComponent } from "./components/email-operations/email-operations.component";
import { CoverLetterOperationsComponent } from "./components/cover-letter-operations/cover-letter-operations.component";
import { ResumeOperationsComponent } from "./components/resume-operations/resume-operations.component";
import { DesignTemplateComponent } from "./components/design-template/design-template.component";
import { CustomSectionComponent } from "./components/custom-section/custom-section.component";
import { CustomSectionEntryComponent } from "./components/custom-section-entry/custom-section-entry.component";
import { ResumeOperationsService } from './services/resume-operations.service';
import { NewJobDialogueComponent } from './components/new-job-dialogue/new-job-dialogue.component';
import { JobService } from '../shared/services/jobSearch.service';
import { JobCampaignCompanyComponent } from './components/job-campaign-company/job-campaign-company.component';
import { CompanyProspectDialogComponent } from './components/job-campaign-company/company-prospect-dialog/company-prospect-dialog.component';
import { AddElementDialogComponent } from './components/job-campaign-company/add-element-dialog/add-element-dialog.component';
import { CoverLetterViewComponent } from './components/cover-letter-view/cover-letter-view.component';
import { CoverLetterDesignComponent } from './components/cover-letter-design/cover-letter-design.component';
import { CoverLetterOverviewComponent } from './components/cover-letter-overview/cover-letter-overview.component';
import { CoverLetterSharedService } from './services/cover-letter-shared.service';
import { ClipboardModule } from 'ngx-clipboard';
@NgModule({
  declarations: [
    DashboardComponent,
    ResumeViewComponent,
    CoverLetterViewComponent,
    EmailViewComponent,
    JobCampaignComponent,
    EmailOperationsComponent,
    CoverLetterOperationsComponent,
    ResumeOperationsComponent,
    DesignTemplateComponent,
    CustomSectionComponent,
    NewJobDialogueComponent,
    CustomSectionEntryComponent,
    NewJobDialogueComponent,
    JobCampaignCompanyComponent,
    CompanyProspectDialogComponent,
    AddElementDialogComponent,
    CoverLetterDesignComponent,
    CoverLetterOverviewComponent
  ],
  imports: [
    CommonModule, 
    SharedModule, 
    DashboardRoutingModule,
    ClipboardModule
  ],
  entryComponents: [
    CustomSectionComponent,
    NewJobDialogueComponent,
    CustomSectionEntryComponent,
    CompanyProspectDialogComponent,
    AddElementDialogComponent
  ],
  providers: [
    ResumeOperationsService, 
    JobService, 
    CoverLetterSharedService
  ]
})
export class DashboardModule { }
