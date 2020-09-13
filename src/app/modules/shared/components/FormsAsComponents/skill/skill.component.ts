import { Component, OnInit, Inject, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-skill',
  templateUrl: './skill.component.html',
  styleUrls: ['./skill.component.scss']
})
export class SkillComponent{

  @Input('skillForm') skillForm: FormGroup;
  @Input('operationType') operationType: string;
  @Output('saveData') saveData = new EventEmitter<any>();
  @Output('close') close = new EventEmitter<any>();
 
 
  saveSkill() {
    if(!this.skillForm.get('showSkillLevel').value) {
     this.skillForm.get('showSkillLevel').patchValue(false);
    }
    this.saveData.emit();
  }
 
  closeForm() {
    this.close.emit();
  }
}
