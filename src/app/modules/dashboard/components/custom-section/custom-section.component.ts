import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-custom-section',
  templateUrl: './custom-section.component.html',
  styleUrls: ['./custom-section.component.scss']
})
export class CustomSectionComponent implements OnInit {

  customSectionForm: FormGroup;
  dialogHeader: string;
  constructor(
    public dialogRef: MatDialogRef<CustomSectionComponent>,
    @Inject(MAT_DIALOG_DATA) public formData,
  ) { }

  ngOnInit() {
    this._createCustomSectionForm();
  }

  closeModal() {
    this.dialogRef.close();
  }

  _createCustomSectionForm() {
    this.customSectionForm = new FormGroup({
      name: new FormControl('', [
        Validators.required
      ]),
      id: new FormControl(Math.random()),
      details : new FormArray([new FormGroup({
        title : new FormControl('', [Validators.required]),
        subtitle : new FormControl(''),
        city : new FormControl(''),
        country : new FormControl(''),
        date : new FormControl(''),
        description : new FormControl('', [Validators.required]),
        id: new FormControl(Math.random())
      })])
      },
      );
  }

  saveCustomSection() {
    this.dialogRef.close(this.customSectionForm)
  }

  get controlArray(): FormArray {
    return <FormArray> this.customSectionForm.get('details');
}

}
