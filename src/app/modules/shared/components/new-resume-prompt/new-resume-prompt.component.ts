import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
@Component({
  selector: 'app-new-resume-prompt',
  templateUrl: './new-resume-prompt.component.html',
  styleUrls: ['./new-resume-prompt.component.scss']
})
export class NewResumePromptComponent {

  displayedColumns: string[] = ['select', 'name'];
  dataSource = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(false, []);

  constructor(public dialogRef: MatDialogRef<NewResumePromptComponent>,
    @Inject(MAT_DIALOG_DATA) data) {
    this.dataSource.data = data;
  }

  closeModal(value) {
    switch (value) {
      case 0: this.dialogRef.close({
        selectionType: 0
      }); break;
      case 1: this.dialogRef.close({
        selectionType: 1
      }); break;
      case 2: this.dialogRef.close({
        selectionType: 2,
        data: this.selection.selected[0]
      }); break;
    }
  }

}
