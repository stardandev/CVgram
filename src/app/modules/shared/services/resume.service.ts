import { ResumePageBounds } from './../models/user-content-representation';
import { UserContent } from './../models/user-content';
import { Injectable } from '@angular/core';
import { AjaxService } from './ajax.service';
import * as fromGlobalStore from '../reducers/global-config.reducer';
import * as fromUserContent from '../reducers/user-content.reducer';
import { Store } from '@ngrx/store';
import { ResumeStructureBuilder } from '../Utils/resumeStructureBuilder';
import { AuthService } from './auth.service';
import { AppUser } from '../models/AppUser';

@Injectable({
  providedIn: 'root'
})
export class ResumeService {

  userContent: UserContent;
  resumePageBonds: ResumePageBounds;
  userDetails: AppUser;
  constructor(
    private ajaxService: AjaxService,
    private userContentStore: Store<fromUserContent.State>,
    private globalStore: Store<fromGlobalStore.State>,
    private authService: AuthService
  ) {
    let globalStoreSelector = fromGlobalStore.globalConfigFeatureKey as any;
    let UserContentselector = fromUserContent.UserContentFeatureKey as any;
    this.userContentStore.select(UserContentselector).subscribe((userContent) => {
      this.userContent = JSON.parse(JSON.stringify(userContent.content));
    });
    this.globalStore.select(globalStoreSelector).subscribe(res => {
      this.resumePageBonds = JSON.parse(JSON.stringify(res.resumePageBounds));
    });
    this.authService.currentUser().subscribe(res => {
      this.userDetails = res;
    })
  }

  saveResume(templateId) {
    let resumeData = ResumeStructureBuilder.createResumeStructure(this.userContent, templateId, this.userDetails.id, this.resumePageBonds.file);
    if(resumeData.id) {
      return this.ajaxService.updateResume(resumeData);
    }else {
      return this.ajaxService.saveResume(resumeData);
    }
  }

  saveTemplate() {
    let data = {
      content: this.resumePageBonds,
      customerId: this.userDetails.id,
      name: this.userContent.cvName
    };
    if (this.resumePageBonds.templateId) {
      return this.ajaxService.updateTemplate(data, this.resumePageBonds.templateId);
    } else {
      return this.ajaxService.saveTemplate(data);
    }
  }

  getAvailableResumes() {
    return this.ajaxService.getAvailableResumes();
  }

  uploadImage(image: File) {
    const formData = new FormData();
    formData.append('content', image)
    formData.append('name', image.name)
    formData.append('customerId', this.userDetails.id)
    return this.ajaxService.uploadImage(formData);
  }

  deleteResume(resumeId) {
    return this.ajaxService.deleteResume(resumeId);
  }

  getTemplate(templateId) {
    return this.ajaxService.getTemplate(templateId);
  }

}
