import { AlertService } from './../../services/alert.service';
import { AppUser } from './../../models/AppUser';
import { UserDetailsFeatureKey } from './../../reducers/user-details.reducer';
import { updateResumePageBounds } from './../../actions/global-configs.actions';
import { ResumePageBounds } from './../../models/user-content-representation';
import { Component, OnInit, Inject, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ImageCroppedEvent, ImageTransform, base64ToFile, Dimensions, ImageCropperComponent } from 'ngx-image-cropper';
import * as fromGlobalStore from '../../reducers/global-config.reducer';
import * as fromUserDetailsStore from '../../reducers/user-details.reducer';
import { Store } from '@ngrx/store';
import { ResumeService } from '../../services/resume.service';
@Component({
  selector: 'app-picture-editor',
  templateUrl: './picture-editor.component.html',
  styleUrls: ['./picture-editor.component.scss']
})
export class PictureEditorComponent {
  imageChangedEvent: any = null;
  croppedImage: any = '';
  canvasRotation = 0;
  rotation = 0;
  scale = 1;
  showCropper = false;
  containWithinAspectRatio = false;
  transform: ImageTransform = {};
  public resumePageBounds: ResumePageBounds;
  resumePageBondsCopy: ResumePageBounds;
  valueChange: any = 0;
  base64String: any;
  uploadingPicture: boolean;
  uesrDetails: AppUser;
  @ViewChild('imageCropper', { static: false }) imageCropper: ImageCropperComponent;

  constructor(
    private globalStore: Store<fromGlobalStore.State>,
    public dialogRef: MatDialogRef<PictureEditorComponent>,
    @Inject(MAT_DIALOG_DATA) public formData,
    private changeRef: ChangeDetectorRef,
    private resumeService: ResumeService,
    private uesrDetailsStore: Store<fromUserDetailsStore.State>,
    private alertService: AlertService
  ) {
    let globalStoreSelector = fromGlobalStore.globalConfigFeatureKey as any;
    let uesrDetailsStoreSelector = fromUserDetailsStore.UserDetailsFeatureKey as any;

    this.globalStore.select(globalStoreSelector).subscribe(res => {
      this.resumePageBounds = res.resumePageBounds;
      this.resumePageBondsCopy = JSON.parse(JSON.stringify(res.resumePageBounds));

      if (this.resumePageBondsCopy.image && this.valueChange == 0) {
        this.valueChange++;
        this.croppedImage = this.resumePageBondsCopy.image;
        this.base64String = this.croppedImage;
      }
    });
    this.uesrDetailsStore.select(uesrDetailsStoreSelector).subscribe(res => {
      this.uesrDetails = res.user;
    })
  }
  updateResumePageBounds(bond, value, subBond?) {
    if (bond != 'dateFormat') {
      this.resumePageBondsCopy[bond] = value;
    } else if (bond == 'dateFormat') {
      this.resumePageBondsCopy[bond][subBond] = value;
    }
    this.globalStore.dispatch(updateResumePageBounds({ data: this.resumePageBondsCopy }));
  }

  fileChangeEvent(event: any): void {  
    this.croppedImage = '';
    this.canvasRotation = 0;
    this.rotation = 0;
    this.scale = 1;
    this.showCropper = false;
    this.containWithinAspectRatio = false;
    this.transform = {} as ImageTransform;

    this.valueChange++;
    this.imageChangedEvent = event;
    // if (event.target.files && event.target.files[0]) {
    //   const file = event.target.files[0];

    //   const reader = new FileReader();
    //   reader.onload = e => {
    //     var res = reader.result.toString();
    //     this.croppedImage = res;

    //     setTimeout(() => {
    //       this.base64String = res;

    //     }, 1000);
    //   }

    //   reader.readAsDataURL(file);
    // }
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    this.updateFileContent(event.base64);
  }

  imageLoaded() {
    this.showCropper = true;
  }

  cropperReady(sourceImageDimensions: Dimensions) {
    this.imageCropper.cropper.x1 = 0;
    this.imageCropper.cropper.y1 = 0;

    this.imageCropper.cropper.x2 = 156;
    this.imageCropper.cropper.y2 = 156;
  }

  loadImageFailed() {
    console.log('Load failed');
  }

  rotateLeft() {
    this.canvasRotation--;
    this.flipAfterRotate();
  }

  rotateRight() {
    this.canvasRotation++;
    this.flipAfterRotate();
  }

  private flipAfterRotate() {
    const flippedH = this.transform.flipH;
    const flippedV = this.transform.flipV;
    this.transform = {
      ...this.transform,
      flipH: flippedV,
      flipV: flippedH
    };
  }


  flipHorizontal() {
    this.transform = {
      ...this.transform,
      flipH: !this.transform.flipH
    };
  }

  flipVertical() {
    this.transform = {
      ...this.transform,
      flipV: !this.transform.flipV
    };
  }

  resetImage() {
    this.scale = 1;
    this.rotation = 0;
    this.canvasRotation = 0;
    this.transform = {};
  }


  toggleContainWithinAspectRatio() {
    this.containWithinAspectRatio = !this.containWithinAspectRatio;
  }

  zoomOut() {
    this.scale -= .1;
    this.transform = {
      ...this.transform,
      scale: this.scale
    };
    this.changeRef.detectChanges();
  }

  zoomIn() {
    this.scale += .1;
    this.transform = {
      ...this.transform,
      scale: this.scale
    };
    this.changeRef.detectChanges();
  }


  updateRotation() {
    this.transform = {
      ...this.transform,
      rotate: this.rotation
    };
  }


  updateFileContent(data) {
    this.resumePageBondsCopy['image'] = data;
    this.globalStore.dispatch(updateResumePageBounds({ data: this.resumePageBondsCopy }));
  }

  closeModal() {
    this.dialogRef.close();
  }

  saveImage() {

    if (this.uesrDetails) {
      if (this.imageChangedEvent) {
        this.saveImageCall(this.imageChangedEvent.target.files[0]);
      } else {
        var self = this;
        this.urltoFile(this.croppedImage, 'profile.png', 'image/png').then(function (file) {
          self.saveImageCall(file);
        })
      }

    } else {
      this.closeModal();
    }
  }


  saveImageCall(file) {
    this.uploadingPicture = true;
    this.resumeService.uploadImage(file)
      .subscribe(res => {
        this.uploadingPicture = false;
        this.resumePageBondsCopy['file'] = res.file;
        this.globalStore.dispatch(updateResumePageBounds({ data: this.resumePageBondsCopy }));
        this.closeModal();
      }, error => {
        this.uploadingPicture = false;
        this.alertService.defaultError();
      });
  }

  urltoFile(url, filename, mimeType) {
    mimeType = mimeType || (url.match(/^data:([^;]+);/) || '')[1];
    return (fetch(url)
      .then(function (res) { return res.arrayBuffer(); })
      .then(function (buf) { return new File([buf], filename, { type: mimeType }); })
    );
  }


}