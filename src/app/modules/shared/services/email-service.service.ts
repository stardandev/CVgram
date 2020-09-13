import { Injectable } from '@angular/core';
import { AjaxService } from './ajax.service';

@Injectable({
  providedIn: 'root'
})
export class EmailServiceService {

  constructor(
    private ajaxService: AjaxService
  ) { }

  createNewEmail(data) {
    return this.ajaxService.createNewCoverLetter(data);
  }

  updateEmail(data) {
    return this.ajaxService.updateCoverLetter(data);
  }

  deleteEmail(item) {
    return this.ajaxService.deleteCoverLetter(item);
  }

  getAllEmails() {
    return this.ajaxService.getAllEmailLetters();
  }

  getEmail(id) {
    return this.ajaxService.getEmail(id);
  }
}
