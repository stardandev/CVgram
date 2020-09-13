import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { StorageService } from './storage.service';
import { Observable } from 'rxjs';
import { AppUser } from '../models/AppUser';
import { JobSearchModel, JobSearchLead, JobSearchLeadActionModel } from '../models/JosSearch.model';

@Injectable({
  providedIn: 'root'
})
export class AjaxService {

  apiUrl = `${environment.api_endpoint}`;

  constructor(
    private _http: HttpClient,
    private _storage: StorageService
  ) { }

  ajaxCall({ headers = new HttpHeaders({ "Content-Type": "application/json" }), method = 'post', url, data = null, withCredentials = false }) {
    return this._http.request<any>(method, this.apiUrl + url, {
      headers: headers,
      body: data,
      withCredentials: withCredentials
    });
  }

  logIn(data): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      withCredentials: true,
      observe: 'response' as 'response'
    };
    return this._http.post(this.apiUrl + 'sessions', data, httpOptions);
  }

  logOut() {
    return this.ajaxCall({ url: 'sessions/current', method: 'delete', withCredentials: true });
  }

  signUp(data) {
    return this.ajaxCall({ url: 'customer-registration-link-requests', method: 'post', data: data });
  }

  completeRegistration(data) {
    return this.ajaxCall({ url: 'customer-registration-requests', method: 'post', data: data });
  }

  getPersonalDetailsCustomSections(): Observable<any[]> {
    return this._http.get<any[]>('assets/PersonalDetailsCustomSections.json');
  }

  requestPasswordResetLink(email) {
    return this.ajaxCall({
      url: 'password-reset-link-requests', method: 'post', data: {
        type: 'customer',
        email: email
      }
    })
  }

  completePasswordReset(data) {
    return this.ajaxCall({ url: 'password-reset-requests', method: 'post', data: data });
  }

  saveResume(data) {
    return this.ajaxCall({ url: 'cvs', method: 'post', data: data, withCredentials: true });
  }

  saveTemplate(data) {
    return this.ajaxCall({ url: 'cv-templates', method: 'post', data: data, withCredentials: true });
  }

  getAvailableResumes() {
    return this.ajaxCall({ url: 'cvs', method: 'get', withCredentials: true });
  }

  uploadImage(data) {
    let headers = new HttpHeaders();
    headers.append("Content-Type", "multipart/form-data");
    return this.ajaxCall({ url: 'files ', method: 'post', data: data, withCredentials: true, headers: headers });
  }

  deleteResume(resumeId) {
    return this.ajaxCall({ url: `cvs/${resumeId}`, method: 'delete', withCredentials: true });
  }

  getTemplate(templateId) {
    return this.ajaxCall({ url: `cv-templates/${templateId}`, method: 'get', withCredentials: true })
  }

  updateTemplate(data, templateId) {
    return this.ajaxCall({ url: `cv-templates/${templateId}`, method: 'PATCH', data: data, withCredentials: true });
  }

  updateResume(data) {
    return this.ajaxCall({ url: `cvs/${data.id}`, method: 'PATCH', data: data, withCredentials: true })
  }

  getAvailableCoverLetters() {
    return this.ajaxCall({ url: `cover-letters?where[type]=paper`, method: 'get', withCredentials: true })
  }

  getAllEmailLetters() {
    return this.ajaxCall({ url: `cover-letters?where[type]=electronic`, method: 'get', withCredentials: true })
  }

  deleteCoverLetter(item) {
    return this.ajaxCall({ url: `cover-letters/${item.id}`, method: 'delete', withCredentials: true });
  }

  createNewCoverLetter(data) {
    return this.ajaxCall({ url: 'cover-letters', method: 'post', data: data, withCredentials: true });
  }

  saveCoverLetterTemplate(data) {
    return this.ajaxCall({ url: 'cover-letter-templates', method: 'post', data: data, withCredentials: true });
  }

  getCoverLetterTemplate(templateId) {
    return this.ajaxCall({ url: `cover-letter-templates/${templateId}`, method: 'get', withCredentials: true })
  }

  updateCoverLetterTemplate(data, templateId) {
    return this.ajaxCall({ url: `cover-letter-templates/${templateId}`, method: 'PATCH', data: data, withCredentials: true });
  }
  updateCoverLetter(data) {
    return this.ajaxCall({ url: `cover-letters/${data.id}`, method: 'PATCH', data: data, withCredentials: true });
  }

  getEmail(id) {
    return this.ajaxCall({ url: `cover-letters/${id}`, method: 'get', withCredentials: true })
  }


  /************************ JOB SEARCH MAIN PAGE METHODS *******************************/

  createJobSearch = (data) => this.ajaxCall({ url: 'job-searches', method: 'POST', data: data, withCredentials: true })

  getJobList = () => this.ajaxCall({ url: 'job-searches', method: 'GET', withCredentials: true })

  deleteJobById = (jobId) => this.ajaxCall({ url: `job-searches/${jobId}`, method: 'DELETE', withCredentials: true });

  /************************ JOB LEAD EDIT PAGE METHODS *******************************/

  getJobLeads = (id) => this.ajaxCall({ url: `job-searches/${id}/leads`, method: 'GET', withCredentials: true });

  createJobSearchLead = (jobLead, id) => this.ajaxCall(
    {
      url: `job-searches/${id}/leads`,
      method: 'POST',
      data: jobLead,
      withCredentials: true
    });

  updateJobSearchLead = (data: JobSearchLead) => this.ajaxCall({
    url: `job-searches/${data.jobSearchId}/leads/${data.id}`,
    method: 'PATCH',
    data: data,
    withCredentials: true
  })


  /********************** JOB SEARCH LEAD ACTION METHODS ********************************/

  createJobSearchLeadActions = (data: JobSearchLeadActionModel, jobSrchId, leadId) => this.ajaxCall(
    {
      url: `job-searches/${jobSrchId}/leads/${leadId}/actions`,
      method: 'POST',
      data: data,
      withCredentials: true
    }
  )

  getJobSearchLeadActions = (jobSearchId, leadId) => this.ajaxCall(
    {
      url: `job-searches/${jobSearchId}/leads/${leadId}/actions`,
      method: 'GET',
      withCredentials: true
    }
  )
}
