import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { TranslateModule } from '@ngx-translate/core';
import { StorageService } from './services/storage.service';
import { AjaxService } from './services/ajax.service';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import {MatDialogModule} from '@angular/material/dialog';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule, MatNativeDateModule, MatIconModule } from '@angular/material';
import {MatRadioModule} from '@angular/material/radio';
import { RouterModule } from '@angular/router';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { NgxEditorModule } from 'ngx-editor';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatSelectModule} from '@angular/material/select';
import {MatTableModule} from '@angular/material/table';
import { QuillModule } from 'ngx-quill'
import Quill from 'quill'
import {MatButtonModule} from '@angular/material/button';
import QuillEmoji from 'quill-emoji';
import { InPlaceEditorModule } from '@syncfusion/ej2-angular-inplace-editor';
import {MatSliderModule} from '@angular/material/slider';
import {MatTooltipModule} from '@angular/material/tooltip';
import { ResumeOverviewComponent } from './components/resume-overview/resume-overview.component';
import { LanguageComponent } from './components/FormsAsComponents/language/language.component';
Quill.register('modules/emoji-shortname', QuillEmoji.ShortNameEmoji);
import {DragDropModule} from '@angular/cdk/drag-drop';

import {MatCardModule} from '@angular/material/card';
import { AuthService } from './services/auth.service';
import { ToastrModule } from 'ngx-toastr';
import { AlertService } from './services/alert.service';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { RegistrationComponent } from './components/registration/registration.component';
import { CompleteRegistrationComponent } from './components/complete-registration/complete-registration.component';
import {MatChipsModule} from '@angular/material/chips';
import { MonthYearPickerComponent } from './components/datepickers/month-year-picker/month-year-picker.component';
import { DatemonthyearPickerComponent } from './components/datepickers/datemonthyear-picker/datemonthyear-picker.component';
import { EducationFormComponent } from './components/FormsAsComponents/education-form/education-form.component';
import { EmploymentFormComponent } from './components/FormsAsComponents/employment-form/employment-form.component';
import { SanitizeHtmlPipe } from './Utils/sanitizer.pipe';
import { PictureEditorComponent } from './components/picture-editor/picture-editor.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { ForgotpasswordComponent } from './components/forgotpassword/forgotpassword.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { CompletePasswordResetComponent } from './components/complete-password-reset/complete-password-reset.component';
import { ResumeService } from './services/resume.service';
import { SkillComponent } from './components/FormsAsComponents/skill/skill.component';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import {NgxPaginationModule} from 'ngx-pagination';
import { LoaderService } from './services/loader.service';
import { CanDeactivateResume } from './services/can-deactivate-resume-operations';
import { EmailServiceService } from './services/email-service.service';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { NewResumePromptComponent } from './components/new-resume-prompt/new-resume-prompt.component';
// Configuration for edior with emoticons
// const toolbarOptions = {
//   container: [
//     ['bold', 'italic', 'underline', 'strike'],       
//     [{ 'list': 'ordered'}, { 'list': 'bullet' }], 
//     [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
//     [{ 'indent': '-1'}, { 'indent': '+1' }],
//     [{ 'color': [] }, { 'background': [] }],
//     [{ 'align': [] }],
//     ['emoji'],
//     ['link']
//   ]
// }
const font = Quill.import('formats/font')
// We do not add Aref Ruqaa since it is the default
font.whitelist = ['mirza', 'roboto', 'aref', 'serif', 'sansserif', 'monospace'];
Quill.register(font, true)
const toolbarOptions = {
  container: [
    ['bold', 'italic', 'underline'],       
    [{ 'list': 'ordered'}, { 'list': 'bullet' }], 
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    [{ 'indent': '-1'}, { 'indent': '+1' }],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'align': [] }],
    ['link']
  ]
}
@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    SignupComponent,
    ResumeOverviewComponent,
    LanguageComponent,
    SkillComponent,
    RegistrationComponent,
    CompleteRegistrationComponent,
    MonthYearPickerComponent,
    DatemonthyearPickerComponent,
    EducationFormComponent,
    EmploymentFormComponent,
    SanitizeHtmlPipe,
    PictureEditorComponent,
    ForgotpasswordComponent,
    ResetPasswordComponent,
    CompletePasswordResetComponent,
    ConfirmDialogComponent,
    NewResumePromptComponent
  ],
  exports: [
    SanitizeHtmlPipe,
    MonthYearPickerComponent,
    DatemonthyearPickerComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    SignupComponent,
    SlickCarouselModule,
    TranslateModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxEditorModule,
    MatExpansionModule,
    MatProgressBarModule,
    MatSelectModule,
    MatTableModule,
    QuillModule,
    MatSliderModule,
    ResumeOverviewComponent,
    LanguageComponent,
    SkillComponent,
    MatButtonModule,
    DragDropModule,
    MatIconModule,
    MatCardModule,
    ToastrModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatTooltipModule,
    EmploymentFormComponent,
    EducationFormComponent,
    InPlaceEditorModule,
    PictureEditorComponent,
    ImageCropperModule,
    ConfirmationPopoverModule,
    NgxPaginationModule,
    NewResumePromptComponent
  ],
  imports: [
    CommonModule,
    ImageCropperModule,
    InPlaceEditorModule,
    SlickCarouselModule,
    TranslateModule,
    MatTooltipModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    RouterModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxEditorModule,
    MatExpansionModule,
    MatProgressBarModule,
    MatSelectModule,
    MatTableModule,
    MatSliderModule,
    MatButtonModule,
    DragDropModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    NgxPaginationModule,
    QuillModule.forRoot({
      modules : {
        toolbar: toolbarOptions,
        "emoji-toolbar": true
    
      },
      placeholder : ''
    }),
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      closeButton : true,
      enableHtml : true
    }),
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: 'danger' // set defaults here
    })
  ],
  providers: [
    AjaxService,
    StorageService,
    AuthService,
    AlertService,
    ResumeService,
    LoaderService,
    CanDeactivateResume,
    EmailServiceService
  ],
  entryComponents : [
    LoginComponent,
    SignupComponent,
    CompleteRegistrationComponent,
    PictureEditorComponent,
    ForgotpasswordComponent,
    CompletePasswordResetComponent,
    ConfirmDialogComponent,
    NewResumePromptComponent
  ]
})
export class SharedModule { }
