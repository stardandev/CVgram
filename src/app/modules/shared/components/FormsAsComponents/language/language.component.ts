import { Component,Input, Output, EventEmitter } from '@angular/core';
import { FormGroup} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.scss']
})
export class LanguageComponent {

 @Input('languageForm') languageForm: FormGroup;
 @Input('operationType') operationType: string;
 @Output('saveData') saveData = new EventEmitter<any>();
 @Output('close') close = new EventEmitter<any>();

 ngOnInit(): void {
 }

 saveLanguage() {
   if(!this.languageForm.get('showDetails').value) {
    this.languageForm.get('showDetails').patchValue(false);
   }
   this.saveData.emit();
 }

 closeForm() {
   this.close.emit();
 }
}
