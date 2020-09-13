import { Component,Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import * as moment from 'moment';
@Component({
  selector: 'app-employment-form',
  templateUrl: './employment-form.component.html',
  styleUrls: ['./employment-form.component.scss']
})
export class EmploymentFormComponent implements OnInit{


  @Input('employmentForm') employmentForm: FormGroup;
  @Input('professionalExperienceEntry') professionalExperienceEntry: FormGroup;
  @Input('operationType') operationType: string;
  @Output('saveData') saveData = new EventEmitter<any>();
  @Output('close') close = new EventEmitter<any>();
  @Output('enableMomentFormat') enableMomentFormat = new EventEmitter<any>();
 
 
  ngOnInit(){
    if (!this.professionalExperienceEntry.get('startedAt').value) {
      this.professionalExperienceEntry.get('startedAt').patchValue(moment());
    }
    if (!this.professionalExperienceEntry.get('endedAt').value) {
      this.professionalExperienceEntry.get('endedAt').patchValue(moment());
    }
  }
  saveEmployment() {
    console.log(this.professionalExperienceEntry)
    this.saveData.emit();
  }
 
  closeForm() {
    this.close.emit();
  }

  enableMoment(professionalExperienceEntry, dayOfMonth) {
    this.enableMomentFormat.emit({
      data : professionalExperienceEntry , 
      event : dayOfMonth
    })
  }

}
