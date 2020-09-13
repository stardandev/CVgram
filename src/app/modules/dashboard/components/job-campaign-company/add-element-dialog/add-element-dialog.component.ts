import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-element-dialog',
  templateUrl: './add-element-dialog.component.html',
  styleUrls: ['./add-element-dialog.component.scss']
})
export class AddElementDialogComponent implements OnInit {

  isNewElement: boolean;
  title: string;

  addElementForm: FormGroup = new FormGroup({});

  constructor(
    public dialogRef: MatDialogRef<AddElementDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.isNewElement = data.isNewElement;
    this.title = data.title;
  }

  ngOnInit() {
    this._createCustomSectionForm();
  }

  _createCustomSectionForm() {
    if (this.isNewElement) {
      this.addElementForm.addControl('companyName', new FormControl('', [Validators.required])) 
    }else {
      this.addElementForm = new FormGroup({
        eventDescription: new FormControl('', [Validators.required]),
        followUpAction: new FormControl('', [Validators.required])
      });
    }
  }

  closeModal() {
    this.dialogRef.close();
  }


  saveCustomSection() {
    this.dialogRef.close(this.addElementForm)
  }
}
