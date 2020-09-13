import { updateCoverLetterTemplate } from './../../../shared/actions/cover-letter.actions';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as fromCoverLetter from '../../../shared/reducers/cover-letter.reducer';

@Component({
  selector: 'app-cover-letter-design',
  templateUrl: './cover-letter-design.component.html',
  styleUrls: ['./cover-letter-design.component.scss']
})
export class CoverLetterDesignComponent{

  coverLetterDesignBonds: any = {};

  
  constructor(
    private router: Router,
    private coverLetterStore: Store<fromCoverLetter.State>
  ) {
    this.coverLetterStore.select(fromCoverLetter.CoverLetterFeatureKey)
    .subscribe(res => {
      this.coverLetterDesignBonds = JSON.parse(JSON.stringify((res as any).coverLetterTemplate));
    });
   }

  navigateToContentModule() {
    this.router.navigate(['dashboard/cover-letter-operations']);
  }

  updateCoverDesign() {
    this.coverLetterStore.dispatch(updateCoverLetterTemplate({data : this.coverLetterDesignBonds}));
  }

  updateLayout(selectedLayout) {
    this.coverLetterDesignBonds.layout = selectedLayout;
    this.updateCoverDesign();
  }

}
