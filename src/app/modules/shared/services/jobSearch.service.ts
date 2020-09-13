import { Injectable } from '@angular/core';
import { AppUser } from '../models/AppUser';
import { AjaxService } from './ajax.service';
import { AuthService } from './auth.service';
import { JobSearchModel } from '../models/JosSearch.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class JobService {
    private userDetails: AppUser;

    constructor(private ajaxService: AjaxService, private authService: AuthService) {
        this.authService.currentUser().subscribe(res => {
            this.userDetails = res;
        })
    }

    /************************ JOB SEARCH MAIN PAGE METHODS *******************************/

    createJobSearch = (data: JobSearchModel) => <Observable<any>>this.ajaxService.createJobSearch(data)

    getJobList = () => <Observable<any>>this.ajaxService.getJobList().pipe(map(res => res.jobSearches));

    deleteJob = (id) => <Observable<any>>this.ajaxService.deleteJobById(id);


    /************************ JOB LEAD EDIT PAGE METHODS *******************************/

    getJobLeads = (id) => <Observable<any>>this.ajaxService.getJobLeads(id).pipe(map(res => res.jobSearchLeads))

    createJobSearchLead = (jobLead, id) => <Observable<any>>this.ajaxService.createJobSearchLead(jobLead, id);

    updateJobSearchLead = (data) => <Observable<any>>this.ajaxService.updateJobSearchLead(data);

    getJobSearchLeadActionList = (jobSearchId, leadId) =>
        <Observable<any>>this.ajaxService.getJobSearchLeadActions(jobSearchId, leadId).pipe(map(res => res.jobSearchLeadActions))

    createJobSearchLeadActions = (data, jobSrchId, leadId) =>
        <Observable<any>>this.ajaxService.createJobSearchLeadActions(data, jobSrchId, leadId);
}
