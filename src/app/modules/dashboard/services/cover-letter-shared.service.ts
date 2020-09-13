import { Injectable } from '@angular/core';
import { AjaxService } from '../../shared/services/ajax.service';

@Injectable({
  providedIn: 'root'
})
export class CoverLetterSharedService {

  constructor(
    private ajaxService: AjaxService
  ) { }

  getAvailableCoverLetters() {
    return this.ajaxService.getAvailableCoverLetters();
  }

  deleteCoverLetter(item) {
    return this.ajaxService.deleteCoverLetter(item);
  }

  createNewCoverLetter(data) {
    if(data.id) {
      return this.ajaxService.updateCoverLetter(data);
    }else {
      return this.ajaxService.createNewCoverLetter(data);
    }
  }

  saveCoverLetterTemplate(coverLetterData,coverLetterTemplateContent,customerId) {
    let data = {
      content: coverLetterTemplateContent,
      customerId: customerId,
      name: coverLetterData.name
    };
    if(coverLetterData.coverLetterTemplateId) {
      return this.ajaxService.updateCoverLetterTemplate(data,coverLetterData.coverLetterTemplateId);
    }else {
      return this.ajaxService.saveCoverLetterTemplate(data);
    }
  }

  getCoverLetterTemplate(templateId) {
    return this.ajaxService.getCoverLetterTemplate(templateId);
  }
}
