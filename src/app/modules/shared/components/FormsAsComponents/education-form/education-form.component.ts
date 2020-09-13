import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-education-form',
  templateUrl: './education-form.component.html',
  styleUrls: ['./education-form.component.scss']
})
export class EducationFormComponent implements OnInit {

  @Input('educationForm') educationForm: FormGroup;
  @Input('educationHistoryEntry') educationHistoryEntry: FormGroup;
  @Input('operationType') operationType: string;
  @Output('saveData') saveData = new EventEmitter<any>();
  @Output('close') close = new EventEmitter<any>();
  @Output('enableMomentFormat') enableMomentFormat = new EventEmitter<any>();


  ngOnInit() {
    if (!this.educationHistoryEntry.get('startedAt').value) {
      this.educationHistoryEntry.get('startedAt').patchValue(moment());
    }
    if (!this.educationHistoryEntry.get('endedAt').value) {
      this.educationHistoryEntry.get('endedAt').patchValue(moment());
    }
  }
  saveEducation() {
    this.saveData.emit();
  }

  closeForm() {
    this.close.emit();
  }

  enableMoment(educationHistoryEntry, dayOfMonth) {
    this.enableMomentFormat.emit({
      data: educationHistoryEntry,
      event: dayOfMonth
    })
  }

}
