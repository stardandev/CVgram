import { updateResumePageBounds, UpdateUserContentRepresentation } from './../../actions/global-configs.actions';
import { updateUserContent } from 'src/app/modules/shared/actions/user-content.actions';
import { UserContent, CustomSection } from './../../models/user-content';
import { Store } from '@ngrx/store';
import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { UserContentRepresentation, ResumePageBounds } from '../../models/user-content-representation';
import * as fromGlobalStore from '../../reducers/global-config.reducer';
import * as fromUserContentStore from '../../reducers/user-content.reducer';
import { DomSanitizer } from '@angular/platform-browser';
import { ResumeService } from '../../services/resume.service';
import { MatDialog } from '@angular/material';
import { AuthService } from '../../services/auth.service';
import { AppUser } from '../../models/AppUser';
import { AlertService } from '../../services/alert.service';
import { ChangeDetectionStrategy } from '@angular/compiler/src/compiler_facade_interface';
import { LoaderService } from '../../services/loader.service';

import * as jsPDF from 'jspdf';
import html2pdf from 'html2pdf.js';
import html2canvas from 'html2canvas';

declare var $: any;
@Component({
  selector: 'app-resume-overview',
  templateUrl: './resume-overview.component.html',
  styleUrls: ['./resume-overview.component.scss']
})
export class ResumeOverviewComponent implements OnInit {
  @ViewChild('scroll', { read: ElementRef, static: true }) public scroll: ElementRef<any>;
  currentPage = 1;
  itemsPerPage = 3;
  userContentRepresentation: any;
  resumePageBounds: ResumePageBounds;
  resumePageBoundsCopy: ResumePageBounds;
  jobTitle: any = {};
  userDetails: AppUser;
  userContent: UserContent;
  personalDetails: any = {};
  sectionOrder: any;
  towColumnsSections: any;
  leftItems: any[] = [];
  rightItems: any[] = [];

  maxPagination: any = 0;
  count: any = 0;
  paginationArr = new Array();
  maxHgt;
  constructor(
    private router: Router,
    private globalStore: Store<fromGlobalStore.State>,
    private UserContentStore: Store<fromUserContentStore.State>,
    private sanitizer: DomSanitizer,
    private resumeService: ResumeService,
    private alertService: AlertService,
    private authService: AuthService,
    private changeRef: ChangeDetectorRef,
    private loaderSrevice: LoaderService
  ) { }

  ngOnInit() {
    let selectore = fromGlobalStore.globalConfigFeatureKey as any;
    let userContentSelector = fromUserContentStore.UserContentFeatureKey as any;
    this.globalStore.select(selectore)
      .subscribe(res => {
        this.resumePageBounds = res.resumePageBounds;
        this.resumePageBoundsCopy = JSON.parse(JSON.stringify(res.resumePageBounds));
        this.personalDetails = res.userContentRepresentation ? res.userContentRepresentation.personalDetails : {};
        this.sectionOrder = JSON.parse(JSON.stringify(res.resumePageBounds.sectionOrder));
        this.towColumnsSections = JSON.parse(JSON.stringify(res.resumePageBounds.towColumnsSections ? res.resumePageBounds.towColumnsSections : {
          leftColumnOrder: [],
          rightColumnOrder: []
        }));
        this.userContentRepresentation = {
          summaryContentEntered: res.userContentRepresentation ? res.userContentRepresentation.summaryContentEntered : false,
          entries: [
            {
              name: 'personalDetails',
              data: res.userContentRepresentation ? res.userContentRepresentation.personalDetails : {}
            }
          ]
        };
        let userContent = JSON.parse(JSON.stringify(res.userContentRepresentation ? res.userContentRepresentation : {}));

        if (res.userContentRepresentation)
          if (res.userContentRepresentation.customSections.length > 0) {
            res.userContentRepresentation.customSections.forEach(element => {
              userContent[element.name] = {
                data: element.details,
                type: 'customSections',
                name: element.name
              }
            });
            delete userContent.customSections;
          }

        this.sectionOrder.forEach((section, index) => {
          let sectionName = '';
          let sectionType = '';
          if (section != 'personalDetails' && section != 'customSections') {
            sectionName = section.displayName;
            sectionType = section.sectionType;
            let sectionSelector = userContent[sectionName] ? sectionName : sectionType;

            if (userContent[sectionSelector]) {
              this.userContentRepresentation.entries.push({
                name: sectionSelector,
                data: userContent[sectionSelector],
                isEven: index % 2 == 0,
                type: userContent[sectionSelector].type ? userContent[sectionSelector].type : null
              })
            }
          } else {
            if (userContent[section]) {
              this.userContentRepresentation.entries.push({
                name: section,
                data: userContent[section],
                isEven: index % 2 == 0,
                type: userContent[section].type ? userContent[section].type : null
              })
            }
          }
        });

        if (this.userContentRepresentation && this.personalDetails.customSections)
          this.personalDetails.customSections.forEach(value => {
            if (value.id == 1) {
              this.jobTitle = value;
            }
          });

        this.leftItems = [];
        this.rightItems = [];
        this.towColumnsSections.leftColumnOrder.forEach((section, index) => {
          let sectionName = '';
          let sectionType = '';
          if (section != 'personalDetails' && section != 'customSections') {
            sectionName = section.displayName;
            sectionType = section.sectionType;
            let sectionSelector = userContent[sectionName] ? sectionName : sectionType;

            if (userContent[sectionSelector]) {
              this.leftItems.push({
                name: sectionSelector,
                data: userContent[sectionSelector],
                isEven: index % 2 == 0,
                type: userContent[sectionSelector].type ? userContent[sectionSelector].type : null
              })
            }
          } else {
            if (userContent[section]) {
              this.leftItems.push({
                name: section,
                data: userContent[section],
                isEven: index % 2 == 0,
                type: userContent[section].type ? userContent[section].type : null
              })
            }
          }
        });
        this.towColumnsSections.rightColumnOrder.forEach((section, index) => {
          let sectionName = '';
          let sectionType = '';
          if (section != 'personalDetails' && section != 'customSections') {
            sectionName = section.displayName;
            sectionType = section.sectionType;
            let sectionSelector = userContent[sectionName] ? sectionName : sectionType;

            if (userContent[sectionSelector]) {
              this.rightItems.push({
                name: sectionSelector,
                data: userContent[sectionSelector],
                isEven: index % 2 == 0,
                type: userContent[sectionSelector].type ? userContent[sectionSelector].type : null
              })
            }
          } else {
            if (userContent[section]) {
              this.rightItems.push({
                name: section,
                data: userContent[section],
                isEven: index % 2 == 0,
                type: userContent[section].type ? userContent[section].type : null
              })
            }
          }
        });
        setTimeout(() => {
          this.setupHeight();
        });
      });
    this.UserContentStore.select(userContentSelector)
      .subscribe(res => {
        this.userContent = res.content;
        let index = 0;
        for (let key in res.content) {
          let value = res.content[key];
          index++;
          if (
            key.toLowerCase() != 'personaldetails' &&
            key.toLowerCase() != 'customsections' &&
            key.toLowerCase() != 'cvname' &&
            key.toLowerCase() != 'id'
          ) {
            let isduplicate = this.sectionOrder.some(({ displayName }) => displayName === value.displayName);
            let isduplicateTwoColumn = this.towColumnsSections.leftColumnOrder.some(({ displayName }) => displayName === value.displayName) || this.towColumnsSections.rightColumnOrder.some(({ displayName }) => displayName === value.displayName);

            if (value.entries) {
              if (value.entries.length > 0) {
                if (!isduplicate) {
                  this.sectionOrder.push({
                    displayName: value.displayName,
                    sectionType: value.sectionType
                  });
                }
                if (!isduplicateTwoColumn) {
                  if (index % 2 == 0) {
                    this.towColumnsSections.leftColumnOrder.push({
                      displayName: value.displayName,
                      sectionType: value.sectionType
                    })
                  } else {
                    this.towColumnsSections.rightColumnOrder.push({
                      displayName: value.displayName,
                      sectionType: value.sectionType
                    })
                  }
                }
              }
            } else if (JSON.stringify(value) != '{}') {
              if (!isduplicate) {
                if (value.sectionType == 'profileSummary' && this.userContentRepresentation.summaryContentEntered) {
                  this.sectionOrder.push({
                    displayName: value.displayName,
                    sectionType: value.sectionType
                  });
                } else if (value.sectionType != 'profileSummary') {
                  this.sectionOrder.push({
                    displayName: value.displayName,
                    sectionType: value.sectionType
                  });
                }
              }

              if (!isduplicateTwoColumn) {
                if (value.sectionType == 'profileSummary' && this.userContentRepresentation.summaryContentEntered) {
                  if (index % 2 == 0) {
                    this.towColumnsSections.leftColumnOrder.push({
                      displayName: value.displayName,
                      sectionType: value.sectionType
                    })
                  } else {
                    this.towColumnsSections.rightColumnOrder.push({
                      displayName: value.displayName,
                      sectionType: value.sectionType
                    })
                  }
                } else if (value.sectionType != 'profileSummary') {
                  if (index % 2 == 0) {
                    this.towColumnsSections.leftColumnOrder.push({
                      displayName: value.displayName,
                      sectionType: value.sectionType
                    })
                  } else {
                    this.towColumnsSections.rightColumnOrder.push({
                      displayName: value.displayName,
                      sectionType: value.sectionType
                    })
                  }
                }
              }
            }
          } else if (key.toLowerCase() === 'customsections') {
            value.forEach(element => {
              let isduplicate = this.sectionOrder.some(({ displayName }) => displayName === element.name);
              if (!isduplicate && element.details.length > 0) {
                this.sectionOrder.push({
                  displayName: element.name,
                  sectionType: element.name
                })
              }
            });

            value.forEach((element, counter) => {
              let isduplicateTwoColumn = this.towColumnsSections.leftColumnOrder.some(({ displayName }) => displayName === element.name) || this.towColumnsSections.rightColumnOrder.some(({ displayName }) => displayName === element.name);

              if (!isduplicateTwoColumn && element.details.length > 0) {
                if (counter % 2 == 0) {
                  this.towColumnsSections.leftColumnOrder.push({
                    displayName: element.name,
                    sectionType: element.name
                  })
                } else {
                  this.towColumnsSections.rightColumnOrder.push({
                    displayName: element.name,
                    sectionType: element.name
                  })
                }
              }
            });


          }
        };
        // this.changeRef.detectChanges();
        this.resumePageBoundsCopy.sectionOrder = this.sectionOrder;
        this.resumePageBoundsCopy.towColumnsSections = this.towColumnsSections;
        this.globalStore.dispatch(updateResumePageBounds({ data: JSON.parse(JSON.stringify(this.resumePageBoundsCopy)) }));
      });
    this.authService.currentUser()
      .subscribe(res => this.userDetails = res);
  }

  download() {
    var data = document.getElementById('box');
    html2canvas(data, { scale: 5 }).then(canvas => {

      var imgData = canvas.toDataURL('image/JPEG');
      var imgWidth = 210;
      var pageHeight = 297;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      var heightLeft = imgHeight;

      var doc = new jsPDF('p', 'mm', "a4");
      var position = 1;

      doc.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, 'FAST');
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        doc.addPage();

        doc.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, 'FAST');
        heightLeft -= pageHeight;
      }
      doc.save("Resume.pdf");

    })
  }

  getDateFormat() {
    return `${this.resumePageBounds.dateFormat.monthFormat}${this.resumePageBounds.dateFormat.separator}${this.resumePageBounds.dateFormat.yearFormat}`
  }

  saveResume() {
    if (this.userContent.cvName.length == 0) {
      this.alertService.displayAlert('info', 'Please give this CV a name before saving it');
      return;
    }
    if (this.userDetails) {
      this.loaderSrevice.showLoader();
      this.resumeService.saveTemplate()
        .subscribe(res => {
          this.resumeService.saveResume(res.cvTemplate.id)
            .subscribe(res => {
              let updatedContent = JSON.parse(JSON.stringify(this.userContent));
              updatedContent['id'] = res.cv.id;
              this.UserContentStore.dispatch(updateUserContent({ data: updatedContent }));
              this.loaderSrevice.stopLoader();
              this.alertService.displayAlert('success', 'Your CV is saved successfully.')
            }, error => {
              this.loaderSrevice.stopLoader();
              this.alertService.defaultError();
            });
        }, error => {
          this.loaderSrevice.stopLoader();
          this.alertService.defaultError();
        });
    } else {
      this.alertService.displayAlert('info', 'Login now or register to save your CV.')
    }
  }


  getSkillLevelDescription(levelNumber) {
    switch (parseInt(levelNumber)) {
      case 1:
        return 'Beginner';
      case 2:
        return 'Average';
      case 3:
        return 'Skilled';
      case 4:
        return 'Specialist';
      case 5:
        return 'Expert';
    }
  }

  ngOnDestroy(): void {
    this.changeRef.detach();
  }

  next() {
    if (this.count < this.maxPagination - 1) {
      this.count++;
      this.scrollToPage();
    }
  }
  paginate(num) {
    this.count = num;
    this.scrollToPage();
  }
  previous() {
    if (this.count > 0) {
      this.count--;
      this.scrollToPage();
    }
  }
  scrollToPage() {

    if (this.scroll.nativeElement.scrollTop == 0 && this.count != 0) {
      this.scroll.nativeElement.scrollTop = this.scroll.nativeElement.clientHeight
    } else {
      this.scroll.nativeElement.scrollTop = this.scroll.nativeElement.scrollTop * this.count;
    }
  }
  setupHeight() {
    this.maxHgt = document.getElementById('resumeStarted').scrollHeight;
    const parentElem = document.getElementById('box');
    var cnt = 1;
    let removedStr = [];
    const self = this;

    parentElem.childNodes.forEach((data: any) => {
      if (data.scrollHeight)
        rec(data);
      function rec(childEl) {
        childEl.childNodes.forEach((elem: any) => {
          if (elem.scrollHeight) {
            if (elem.classList.contains("left-items") || elem.classList.contains("right-items")) {
              self.maxHgt = document.getElementById('resumeStarted').scrollHeight;
            }
            let verticalMrgn = self.resumePageBounds.formatting.verticalMargin;
            if (elem.offsetTop + elem.clientHeight + (verticalMrgn * 3.779527559055) > self.maxHgt) {

              innerFun(elem);
              function innerFun(el) {
                if (el.childNodes.length > 1 && el.childNodes[1].nodeName != "#comment") {
                  if (el.childNodes[1].classList.contains("addedElement")) {
                    cnt++;
                    self.setMaxHeight(cnt);
                    return;
                  }
                }
                if (el.childNodes.length == 1 && el.scrollHeight) {
                  if (el.parentNode.classList.contains("cv-bl") || el.parentNode.classList.contains("language-detail-container")) {
                    el.parentNode.style.marginTop = verticalMrgn + "mm";
                    cnt++;
                    self.setMaxHeight(cnt);
                  } else {
                    let headerStyle = "";
                    if (elem.classList.contains("cv-profile-heading") && !elem.classList.contains("addedElement")) {
                      headerStyle = elem.childNodes[0].childNodes[0].style.cssText;
                    }
                    getOverflowIndex(elem.textContent);
                    function getOverflowIndex(overFlowStr) {
                      var str: any;
                      if (overFlowStr) {
                        if (overFlowStr.indexOf(' ') != -1) {
                          str = overFlowStr.split(' ');
                          removedStr.unshift(str.pop());
                          str = str.join(' ');
                          elem.textContent = str;
                        } else {
                          removedStr.unshift(overFlowStr);
                          elem.textContent = '';
                        }
                        if (elem.offsetTop + elem.clientHeight + (verticalMrgn * 3.779527559055) > self.maxHgt) {
                          getOverflowIndex(str);
                        }
                        if ((elem.clientHeight < 1)) return;
                      }
                    }
                    if (removedStr.length > 0) {
                      if (headerStyle) {
                        let h6 = document.createElement("h6");
                        h6.classList.add("addedElement", "heading-container");
                        h6.style.cssText = `width: 100%;margin-bottom: 0px;font-size: 14px;font-weight: bold;`

                        let a = document.createElement("a");
                        a.classList.add("addedElement", "cv-p-h");
                        a.style.cssText = headerStyle + `width: 100%;
                        display: flex;
                        -webkit-box-align: center;
                        align-items: center;
                        margin-bottom: 0.52em;
                        border-bottom: solid rgb(0, 0, 0);`;
                        a.textContent = removedStr.join(' ');

                        h6.appendChild(a.cloneNode(true));
                        if (verticalMrgn) {
                          h6.style.marginTop = (verticalMrgn * 2) + 5 + "mm";
                        } else {
                          h6.style.marginTop = "50px";
                        }
                        elem.appendChild(h6.cloneNode(true));


                      } else {
                        let p = document.createElement("p");
                        p.setAttribute("class", "addedElement");
                        p.textContent = removedStr.join(' ');
                        if (verticalMrgn) {
                          p.style.marginTop = (verticalMrgn * 2) + 5 + "mm";
                        } else {
                          p.style.marginTop = "50px";
                        }
                        elem.appendChild(p.cloneNode(true));
                      }
                      cnt++;
                      self.setMaxHeight(cnt);
                    }
                  }
                } else {
                  el.childNodes.forEach(res => {
                    if (res.clientHeight)
                      rec(res);
                  })
                }
              }
            }
            rec(elem);
          }
        })
      }
    })
    document.getElementById("box").style.height = "auto";

    let clientHt = this.scroll.nativeElement.clientHeight;
    let scrollHt = this.scroll.nativeElement.scrollHeight;

    this.maxPagination = Math.ceil(scrollHt / clientHt);
    let desireScrollHt = clientHt * this.maxPagination - 1;
    this.paginationArr = Array.from({ length: this.maxPagination }, (v, k) => k + 1);
    document.getElementById("box").style.height = (desireScrollHt - 1) + "px";

    let colTwo = document.getElementById("twoCol");
    if (colTwo) {
      colTwo.style.height = "inherit";
    }
    if (this.count != 0) {
      this.scroll.nativeElement.scrollTop = clientHt * this.count;
    }
  }

  setMaxHeight(count) {
    this.maxHgt = document.getElementById('resumeStarted').scrollHeight * count;
  }
  getLanguageLevelString(level) {
    switch (level) {
      case "1": return 'Basic';
      case "2": return 'Intermediate';
      case "3": return 'Advanced';
      case "4": return 'Native or Bilingual';
    }
  }
}