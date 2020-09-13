import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-new-job-dialogue',
  templateUrl: './new-job-dialogue.component.html',
  styleUrls: ['./new-job-dialogue.component.scss']
})
export class NewJobDialogueComponent implements OnInit {

  dialogHeader: string;
  newJobForm:FormGroup;
  constructor(
    public dialogRef: MatDialogRef<NewJobDialogueComponent>,
    @Inject(MAT_DIALOG_DATA) public formData,
  ) { }

  ngOnInit() {
    this._createCustomSectionForm();
  }

  closeModal() {
    this.dialogRef.close();
  }

  _createCustomSectionForm() {
    this.newJobForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl('',[Validators.required])
    },
    );
  } 

  saveNewJob() {
    this.dialogRef.close(this.newJobForm)
  }

  get controlArray(): FormArray {
    return <FormArray>this.newJobForm.get('details');
  }


}
