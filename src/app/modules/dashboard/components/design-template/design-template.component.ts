import { updateResumePageBounds } from './../../../shared/actions/global-configs.actions';
import { Store } from '@ngrx/store';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import * as fromGlobalStore from '../../../shared/reducers/global-config.reducer';
import { ResumePageBounds } from 'src/app/modules/shared/models/user-content-representation';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from 'src/app/modules/shared/components/confirm-dialog/confirm-dialog.component';
import { ResumeOverviewComponent } from 'src/app/modules/shared/components/resume-overview/resume-overview.component';
import { ResumeService } from 'src/app/modules/shared/services/resume.service';
import { AlertService } from 'src/app/modules/shared/services/alert.service';
import { AuthService } from 'src/app/modules/shared/services/auth.service';
import { LoaderService } from 'src/app/modules/shared/services/loader.service';
import * as fromUserContentStore from '../../../shared/reducers/user-content.reducer';
import { updateUserContent } from 'src/app/modules/shared/actions/user-content.actions';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Component({
  selector: 'app-design-template',
  templateUrl: './design-template.component.html',
  styleUrls: ['./design-template.component.scss']
})
export class DesignTemplateComponent implements OnInit {

  public sectionOrder: any[] = [];
  disableColumnSpacing: boolean = true;
  public resumePageBounds: ResumePageBounds;
  resumePageBondsCopy: ResumePageBounds;
  towColumnsSections: any = {
    leftColumnOrder: [],
    rightColumnOrder: []
  };
  constructor(
    private globalStore: Store<fromGlobalStore.State>,
    private router: Router,
    private _dialog: MatDialog,
    private resumeService: ResumeService,
    private alertService: AlertService,
    private loaderSrevice: LoaderService
  ) { }

  ngOnInit() {
    let globalStoreSelector = fromGlobalStore.globalConfigFeatureKey as any;
    this.globalStore.select(globalStoreSelector).subscribe(res => {
      this.resumePageBounds = res.resumePageBounds;
      this.resumePageBondsCopy = JSON.parse(JSON.stringify(res.resumePageBounds));
      this.sectionOrder = JSON.parse(JSON.stringify(res.resumePageBounds.sectionOrder));
      this.towColumnsSections = JSON.parse(JSON.stringify(res.resumePageBounds.towColumnsSections ? res.resumePageBounds.towColumnsSections : {
        leftColumnOrder: [],
        rightColumnOrder: []
      }));
    })
  }

  dropDoubleColumn(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }

    this.resumePageBondsCopy.towColumnsSections = this.towColumnsSections;
    this.globalStore.dispatch(updateResumePageBounds({ data: JSON.parse(JSON.stringify(this.resumePageBondsCopy)) }));
  }

  navigateToContentModule() {
    this.router.navigate(['dashboard/resume-operations']);
  }

  drop(event: CdkDragDrop<string[]>) {
    // if(this.sectionOrder.length < 2) return;
    moveItemInArray(this.sectionOrder, event.previousIndex, event.currentIndex);
    this.resumePageBondsCopy.sectionOrder = this.sectionOrder;
    this.globalStore.dispatch(updateResumePageBounds({ data: JSON.parse(JSON.stringify(this.resumePageBondsCopy)) }));
  }

  updateResumeFormatting() {
    this.globalStore.dispatch(updateResumePageBounds({ data: this.resumePageBondsCopy }));
  }

  updateResumePageBounds(bond, value, subBond?, nestedBondUpdate?) {
    if (bond != 'dateFormat' && !nestedBondUpdate) {
      this.resumePageBondsCopy[bond] = value;
    } else if (bond == 'dateFormat' || nestedBondUpdate) {
      this.resumePageBondsCopy[bond][subBond] = value;
    }
    this.globalStore.dispatch(updateResumePageBounds({ data: this.resumePageBondsCopy }));
  }


  updateColumnFormatting(bond, value, subBond?) {
    if (subBond == 'leftWidth') {
      if (this.resumePageBondsCopy[bond]['leftWidth'] != 100) {
        this.resumePageBondsCopy[bond]['leftWidth'] = this.resumePageBondsCopy[bond]['leftWidth'] + 1;
        this.resumePageBondsCopy[bond]['rightWidth'] = this.resumePageBondsCopy[bond]['rightWidth'] - 1;
      }
    } else if (subBond == 'rightWidth') {
      if (this.resumePageBondsCopy[bond]['rightWidth'] != 100) {
        this.resumePageBondsCopy[bond]['rightWidth'] = this.resumePageBondsCopy[bond]['rightWidth'] + 1;
        this.resumePageBondsCopy[bond]['leftWidth'] = this.resumePageBondsCopy[bond]['leftWidth'] - 1;
      }
    }
    this.globalStore.dispatch(updateResumePageBounds({ data: this.resumePageBondsCopy }));
  }


  increaseColumnSpacing(operation) {
    let sum = (this.resumePageBondsCopy['columns']['leftWidth'] + 1) + (this.resumePageBondsCopy['columns']['rightWidth'] + 1);
    if (operation == 1) {
      this.resumePageBondsCopy['columns']['leftWidth'] = this.resumePageBondsCopy['columns']['leftWidth'] - 1;
      this.resumePageBondsCopy['columns']['rightWidth'] = this.resumePageBondsCopy['columns']['rightWidth'] - 1;
    } else if (operation == 2) {
      if (sum < 101) {
        this.resumePageBondsCopy['columns']['leftWidth'] = this.resumePageBondsCopy['columns']['leftWidth'] + 1;
        this.resumePageBondsCopy['columns']['rightWidth'] = this.resumePageBondsCopy['columns']['rightWidth'] + 1;
      }
    } else {
      this.resumePageBondsCopy['columns']['leftWidth'] = 50;
      this.resumePageBondsCopy['columns']['rightWidth'] = 50;
    }

    if (sum < 101) {
      this.disableColumnSpacing = false;
    } else {
      this.disableColumnSpacing = true;
    }
    this.globalStore.dispatch(updateResumePageBounds({ data: this.resumePageBondsCopy }));
  }

  fileUploaded($event) {
    const file = ($event.target as any).files[0];
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (_event) => {
      this.updateResumePageBounds('image', reader.result);
    }
  }

  isDataSaved() {
    let result = Observable.create((observer) => {
      const dialogRef = this._dialog.open(ConfirmDialogComponent, {
        disableClose: true,
        width: '530px',
      });
      dialogRef.afterClosed().subscribe((res) => {
        if (res == 1) {
          this.loaderSrevice.showLoader();
          this.resumeService.saveTemplate().subscribe(res => {
            this.resumeService.saveResume(res.cvTemplate.id).subscribe(res => {
              this.loaderSrevice.stopLoader();
              observer.next(true)
              //this.alertService.displayAlert('success', 'Your CV is saved successfully.')
            }, error => {
              observer.next(false)
              this.loaderSrevice.stopLoader();
              this.alertService.defaultError();
            });
          }, error => {
            observer.next(false)
            this.loaderSrevice.stopLoader();
            this.alertService.defaultError();
          });
        } else if (res == 2) {
          observer.next(true);
        }
      });
    })
    return result.pipe(map(res => res));

  }



}
