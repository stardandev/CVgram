import { Injectable } from '@angular/core';
import { AjaxService } from '../../shared/services/ajax.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResumeOperationsService {

  constructor(
    private ajaxService: AjaxService
  ) { }

  getPersonalDetailsCustomSections(): Observable<any[]> {
    return this.ajaxService.getPersonalDetailsCustomSections();
  }
}
