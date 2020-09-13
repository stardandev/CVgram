import { Component, OnInit, Input } from '@angular/core';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MatDatepicker} from '@angular/material/datepicker';

import * as moment from 'moment';
import { FormControl, FormGroup, NgForm, ControlContainer } from '@angular/forms';


export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-month-year-picker',
  templateUrl: './month-year-picker.component.html',
  styleUrls: ['./month-year-picker.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS}
  ]
})
export class MonthYearPickerComponent {

  constructor() {}


  @Input('targetGroup') targetGroup: FormGroup;
  @Input('controlType') controlType: string;
  @Input('parentFormGroup') parentFormGroup: FormGroup;

  maxDate = new Date();

  chosenYearHandler(normalizedYear: moment.Moment) {
    const ctrlValue = moment(this.parentFormGroup.get(this.controlType).value);
    ctrlValue.year(normalizedYear.year());
    this.parentFormGroup.get(this.controlType).patchValue(ctrlValue);
  }

  chosenMonthHandler(normalizedMonth: moment.Moment, datepicker: MatDatepicker<moment.Moment>) {
    const ctrlValue = moment(this.parentFormGroup.get(this.controlType).value);
    ctrlValue.month(normalizedMonth.month());
    this.parentFormGroup.get(this.controlType).patchValue(ctrlValue);
    datepicker.close();
  }

}
