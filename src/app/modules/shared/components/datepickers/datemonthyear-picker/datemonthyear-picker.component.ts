import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-datemonthyear-picker',
  templateUrl: './datemonthyear-picker.component.html',
  styleUrls: ['./datemonthyear-picker.component.scss']
})
export class DatemonthyearPickerComponent  {

  @Input('parentFormGroup') parentFormGroup: FormGroup;
  @Input('controlType') controlType: string;
  maxDate = new Date();

  ngOnInit(): void {
    this.parentFormGroup.get('startedAt').patchValue(new Date(this.parentFormGroup.get('startedAt').value));
    this.parentFormGroup.get('endedAt').patchValue(new Date(this.parentFormGroup.get('endedAt').value));
  }

}
