import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-custom-section-entry',
  templateUrl: './custom-section-entry.component.html',
  styleUrls: ['./custom-section-entry.component.scss']
})
export class CustomSectionEntryComponent implements OnInit {


  customSectionEntryForm: FormGroup;
  dialogHeader: string;
  constructor(
    public dialogRef: MatDialogRef<CustomSectionEntryComponent>,
    @Inject(MAT_DIALOG_DATA) public formData,
  ) { }

  ngOnInit() {
    this._createCustomSectionEntryForm(this.formData.section);

  }

  closeModal() {
    this.dialogRef.close();
  }

  _createCustomSectionEntryForm(data) {
    this.customSectionEntryForm = new FormGroup({
        title : new FormControl(data ? data.title : '', [Validators.required]),
        subtitle : new FormControl(data ? data.subtitle : ''),
        city : new FormControl(data ? data.city : ''),
        country : new FormControl(data ? data.country : ''),
        date : new FormControl(data ? data.date : ''),
        description : new FormControl(data ? data.description : '',),
        id: new FormControl(data ? data.id : Math.random())
      });
  }

  saveCustomSectionEntry() {
    this.dialogRef.close({
      entryData : this.customSectionEntryForm,
      sectionDetails: this.formData
    })
  }

}
