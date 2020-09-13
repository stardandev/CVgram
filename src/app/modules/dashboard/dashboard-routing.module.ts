import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ResumeViewComponent } from './components/resume-view/resume-view.component';
import { CoverLetterViewComponent } from './components/cover-letter-view/cover-letter-view.component';
import { EmailViewComponent } from './components/email-view/email-view.component';
import { JobCampaignComponent } from './components/job-campaign/job-campaign.component';
import { EmailOperationsComponent } from './components/email-operations/email-operations.component';
import { CoverLetterOperationsComponent } from './components/cover-letter-operations/cover-letter-operations.component';
import { ResumeOperationsComponent } from './components/resume-operations/resume-operations.component';
import { DesignTemplateComponent } from './components/design-template/design-template.component';
import { CanDeactivateResume } from '../shared/services/can-deactivate-resume-operations';
import { CoverLetterDesignComponent } from './components/cover-letter-design/cover-letter-design.component';
import { JobCampaignCompanyComponent } from './components/job-campaign-company/job-campaign-company.component';

const routes: Routes = [

  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: '',
        redirectTo: '/dashboard/cv',
        pathMatch: 'full'
      },
      {
        path: 'cv',
        component: ResumeViewComponent
      },
      {
        path : 'cover-letter',
        component : CoverLetterViewComponent
      },
      {
        path: 'email-letter',
        component: EmailViewComponent
      },
      {
        path: 'job-search-logbook',
        children: [
          {
            path: '',
            component: JobCampaignComponent
          },
          {
            path: 'Job-Company',
            component: JobCampaignCompanyComponent
          }
        ]
      },
      {
        path: 'email-operations',
        component: EmailOperationsComponent
      },
      {
        path: 'cover-letter-operations',
        component: CoverLetterOperationsComponent
      },
      {
        path : 'cover-letter-design',
        component : CoverLetterDesignComponent
      },
      {
        path : 'resume-operations',
        component : ResumeOperationsComponent,
        canDeactivate: [CanDeactivateResume]
      },
      {
        path : 'design-template',
        component : DesignTemplateComponent,
        canDeactivate: [CanDeactivateResume]
      },

      {
        path: '**',
        redirectTo: '/dashboard/cv',
        pathMatch: 'full'
      },

    ]
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
