import { updateCoverLetter } from './../../../shared/actions/cover-letter.actions';
import { FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromCoverLetter from '../../../shared/reducers/cover-letter.reducer';

@Component({
  selector: 'app-cover-letter-operations',
  templateUrl: './cover-letter-operations.component.html',
  styleUrls: ['./cover-letter-operations.component.scss']
})
export class CoverLetterOperationsComponent implements OnInit {

  coverLetterData:any;

  constructor(
    private router: Router,
    private coverLetterStore: Store<fromCoverLetter.State>,
  ) { }

  ngOnInit() {
    
    this.coverLetterStore.select(fromCoverLetter.CoverLetterFeatureKey)
      .subscribe(res => {
          this.coverLetterData = JSON.parse(JSON.stringify((res as any).coverLetter));
      })
  }

  updateCoverLetterData() {
    this.coverLetterStore.dispatch(updateCoverLetter({data : this.coverLetterData}));
  }


  navigateToDesignModule() {
    this.router.navigate(['/dashboard/cover-letter-design'])
  }

}
