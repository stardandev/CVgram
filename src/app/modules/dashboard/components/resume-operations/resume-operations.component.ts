import { ResumePageBounds, PersonalDetails } from './../../../shared/models/user-content-representation';
import { UpdateUserContentRepresentation, updateResumePageBounds } from './../../../shared/actions/global-configs.actions';
import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromUserContent from '../../../shared/reducers/user-content.reducer';
import * as fromGlobalStore from '../../../shared/reducers/global-config.reducer';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { updateUserContent } from 'src/app/modules/shared/actions/user-content.actions';
import { DomSanitizer } from '@angular/platform-browser';
import { cloneAbstractControl } from 'src/app/modules/shared/Utils/utils';
import { MatDialog } from '@angular/material';
import { UserContentRepresentation } from 'src/app/modules/shared/models/user-content-representation';
import { CustomSectionComponent } from '../custom-section/custom-section.component';
import { CustomSectionEntryComponent } from '../custom-section-entry/custom-section-entry.component';
import { StorageService } from 'src/app/modules/shared/services/storage.service';
import * as moment from 'moment';
import { InPlaceEditor, ActionBlur } from '@syncfusion/ej2-inplace-editor'
import { ResumeOperationsService } from '../../services/resume-operations.service';
import { PictureEditorComponent } from 'src/app/modules/shared/components/picture-editor/picture-editor.component';
import { Router } from '@angular/router';
import { ConfirmDialogComponent } from 'src/app/modules/shared/components/confirm-dialog/confirm-dialog.component';
import { ResumeService } from 'src/app/modules/shared/services/resume.service';
import { AlertService } from 'src/app/modules/shared/services/alert.service';
import { LoaderService } from 'src/app/modules/shared/services/loader.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Component({
  selector: 'app-resume-operations',
  templateUrl: './resume-operations.component.html',
  styleUrls: ['./resume-operations.component.scss']
})
export class ResumeOperationsComponent implements OnInit {

  profileCompletenessPercentage: number = 0;
  summaryContentEntered: boolean;

  //Variables for toggling Add and edit forms for fields like Employment, Education, Language, skills and Custom Sections
  showLanguageForm: boolean;
  showLanguageEditForm: boolean;

  showSkillForm: boolean;
  showSkillEditForm: boolean;

  showEmploymentForm: boolean;
  showEmploymentEditForm: boolean;

  showEducationForm: boolean;
  showEducationEditForm: boolean;

  resumePageBondsCopy: ResumePageBounds;

  professionalExperienceEntry = new FormGroup({
    employerName: new FormControl('', [Validators.required]),
    jobTitle: new FormControl(''),
    department: new FormControl(''),
    city: new FormControl(''),
    country: new FormControl(''),
    startedAt: new FormControl(moment()),
    endedAt: new FormControl(moment()),
    description: new FormControl(),
    id: new FormControl(Math.random()),
    present: new FormControl(false)
  });
  educationHistoryEntry = new FormGroup({
    schoolName: new FormControl(''),
    schoolName2: new FormControl(''),
    studiesName: new FormControl(''),
    degree: new FormControl(''),
    city: new FormControl(''),
    country: new FormControl(''),
    startedAt: new FormControl(moment()),
    endedAt: new FormControl(moment()),
    description: new FormControl(''),
    id: new FormControl(Math.random()),
    present: new FormControl(false)
  });

  languageForm = new FormGroup({
    name: new FormControl('', [
      Validators.required
    ]),
    writingSkills: new FormControl(''),
    speakingSkills: new FormControl(''),
    description: new FormControl(''),
    showDetails: new FormControl(false),
    id: new FormControl(Math.random())
  });

  skillForm = new FormGroup({
    name: new FormControl('', [
      Validators.required
    ]),
    level: new FormControl(''),
    showSkillLevel: new FormControl(false),
    id: new FormControl(Math.random())
  });

  displayedColumns: string[] = ['name', 'showDetails', 'Actions'];
  skillsDisplayedColumns: string[] = ['Skill', 'showSkillLevel', 'Actions'];
  userContent: FormGroup = new FormGroup({});
  userContentRepresentation: UserContentRepresentation;

  personalDetailsCustomSections = [];
  public currentLanguage: string = '';

  constructor(
    private userContentStore: Store<fromUserContent.State>,
    private globalStore: Store<fromGlobalStore.State>,
    private _dialog: MatDialog,
    private _storage: StorageService,
    private _resumeOperationsService: ResumeOperationsService,
    private changeRef: ChangeDetectorRef,
    private router: Router,

    private resumeService: ResumeService,
    private alertService: AlertService,
    private loaderSrevice: LoaderService
  ) {
    this._resumeOperationsService.getPersonalDetailsCustomSections()
      .subscribe(res => {
        this.personalDetailsCustomSections = res;
        this.removeExistingPersonalDetailsCustomSections();
      });
    this._storage.getCurrentLanguage()
      .subscribe(res => {
        this.currentLanguage = res;
      });
  }

  public elementModel: Object = {};

  ngOnInit() {
    let globalStoreSelector = fromGlobalStore.globalConfigFeatureKey as any;
    let selector = (fromUserContent.UserContentFeatureKey) as any
    this.userContentStore.select(selector).subscribe((userContent) => {

      if (JSON.stringify(this.userContent.value) == '{}') {
        this.prepareUserContentForm(userContent);
        this.prepareDisplayData(userContent.content);
        this.calculateProfileCompleteness(userContent.content);
      }
    });
    this.userContent.valueChanges.subscribe(res => {
      this.prepareDisplayData(res);
      this.userContentStore.dispatch(updateUserContent(
        { data: res }
      ));
      this.calculateProfileCompleteness(res);
    });

    this.globalStore.select(globalStoreSelector).subscribe(res => {
      this.resumePageBondsCopy = JSON.parse(JSON.stringify(res.resumePageBounds));
    })
  }

  prepareUserContentForm(userContent) {
    for (let key in userContent.content) {
      if (typeof userContent.content[key] == 'string'
        || userContent.content[key] == null
      ) {
        this.userContent.addControl(
          key,
          new FormControl(userContent.content[key] ? userContent.content[key] : '')
        );
      } else if (Array.isArray(userContent.content[key])) {
        this.userContent.addControl(
          key,
          new FormArray([])
        );
        let formArray = this.userContent.get(key) as FormArray;

        userContent.content[key].forEach(value => {
          let formGroup = new FormGroup({});
          for (key in value) {

            if (typeof value[key] == 'string' || !isNaN(value[key]) || value[key] == null) {
              formGroup.addControl(
                key,
                new FormControl(value[key])
              )
            } else if (Array.isArray(value[key])) {
              formGroup.addControl(
                key,
                new FormArray([])
              )
              let value_key_formArray = formGroup.get(key) as FormArray;
              value[key].forEach(element => {
                let innerFormGroup = new FormGroup({});
                for (let innerkey in element) {
                  innerFormGroup.addControl(
                    innerkey,
                    new FormControl(element[innerkey])
                  )
                }
                value_key_formArray.push(innerFormGroup);
              });
            } else {
              // TODO when key[value] is a formgroup
            }
          }
          formArray.push(formGroup);
        });
      } else {
        this.userContent.addControl(
          key,
          new FormGroup({})
        );
        let formGroup = this.userContent.get(key) as FormGroup;
        for (let contentKeys in userContent.content[key]) {

          if (typeof userContent.content[key][contentKeys] == 'string' || userContent.content[key][contentKeys] == null) {
            formGroup.addControl(
              contentKeys,
              new FormControl(userContent.content[key][contentKeys])
            )
          } else if (Array.isArray(userContent.content[key][contentKeys])) {

            formGroup.addControl(
              contentKeys,
              new FormArray([])
            )
            let value_key_formArray = formGroup.get(contentKeys) as FormArray;
            userContent.content[key][contentKeys].forEach(element => {
              let innerFormGroup = new FormGroup({});
              for (let innerkey in element) {
                innerFormGroup.addControl(
                  innerkey,
                  new FormControl(element[innerkey])
                )
              }
              value_key_formArray.push(innerFormGroup);
            });

          }
        }
      }
    }

  }

  prepareDisplayData(data) {

    if (data.profileSummary) {
      this.summaryContentEntered = data.profileSummary.content ? data.profileSummary.content.replace(/(<([^>]+)>)/ig, '').length > 0 : false;
    } else {
      this.summaryContentEntered = false;
    }

    this.userContentRepresentation = {
      personalDetails: {
        namePrefix: data.personalDetails.namePrefix,
        name: `${data.personalDetails.firstName} ${data.personalDetails.middleName} ${data.personalDetails.lastName}`,
        address: `${data.personalDetails.addressLineOne} ${data.personalDetails.addressLineTwo ? '/ ' + data.personalDetails.addressLineTwo : ''}${(data.personalDetails.addressLineOne || data.personalDetails.addressLineTwo) && data.personalDetails.city ? ', ' + data.personalDetails.city : data.personalDetails.city}${(data.personalDetails.addressLineOne || data.personalDetails.addressLineTwo || data.personalDetails.city) && data.personalDetails.postalCode ? ', ' + data.personalDetails.postalCode : ''}${(data.personalDetails.addressLineOne || data.personalDetails.addressLineTwo || data.personalDetails.city || data.personalDetails.postalCode) && data.personalDetails.country ? ', ' + data.personalDetails.country : data.personalDetails.country}`,
        mobile: data.personalDetails.phone,
        email: data.personalDetails.email,
        customSections: data.personalDetails.customSections,
        addressLineOne: data.personalDetails.addressLineOne,
        addressLineTwo: data.personalDetails.addressLineTwo,
        city: data.personalDetails.city,
        country: data.personalDetails.country,
        postalCode: data.personalDetails.postalCode
      },
      profileSummary: data.profileSummary,
      professionalExperience: JSON.parse(JSON.stringify(data.professionalExperience)),
      education: JSON.parse(JSON.stringify(data.education)),
      language: JSON.parse(JSON.stringify(data.language)),
      skills: JSON.parse(JSON.stringify(data.skills)),
      customSections: JSON.parse(JSON.stringify(data.customSections)),
      summaryContentEntered: this.summaryContentEntered
    }

    this.removeExistingPersonalDetailsCustomSections();

    this.globalStore.dispatch(UpdateUserContentRepresentation({
      userContentRepresentation: this.userContentRepresentation
    }));
  }

  removeExistingPersonalDetailsCustomSections() {
    this.userContentRepresentation.personalDetails.customSections.forEach((value, index) => {
      for (let i = 0; i < this.personalDetailsCustomSections.length; i++) {
        let innerValue = this.personalDetailsCustomSections[i];
        if (value.name == innerValue.value) {
          this.personalDetailsCustomSections.splice(i, 1);
          break;
        }
      }
    })
  }

  addEntry(type, data?: any | FormGroup) {
    switch (type) {
      case 'work':
        let professionalExperience = this.userContent.get('professionalExperience').get('entries') as FormArray;
        this.professionalExperienceEntry.get('id').patchValue(Math.random());
        let professionalExperienceEntryClone = cloneAbstractControl(this.professionalExperienceEntry);
        professionalExperience.push(professionalExperienceEntryClone);
        this.professionalExperienceEntry.reset();
        this.professionalExperienceEntry.get('startedAt').patchValue(moment());
        this.professionalExperienceEntry.get('endedAt').patchValue(moment());
        break;
      case 'education':
        let education = this.userContent.get('education').get('entries') as FormArray;
        let educationHistoryEntryClone = cloneAbstractControl(this.educationHistoryEntry);
        this.educationHistoryEntry.get('id').patchValue(Math.random());
        education.push(educationHistoryEntryClone);
        this.educationHistoryEntry.reset();
        this.educationHistoryEntry.get('startedAt').patchValue(moment());
        this.educationHistoryEntry.get('endedAt').patchValue(moment());
        break;
      case 'language':
        let language = this.userContent.get('language').get('entries') as FormArray;
        data.get('id').patchValue(Math.random());
        let languageEntryClone = cloneAbstractControl(data);
        language.push(languageEntryClone);
        data.reset();
        break;
      case 'name':
        let skills = this.userContent.get('skills').get('entries') as FormArray;
        data.get('id').patchValue(Math.random());
        let skillsEntryClone = cloneAbstractControl(data);
        skills.push(skillsEntryClone);
        data.reset();
        break;
      case 'customSections':
        let customSections = this.userContent.get('customSections') as FormArray;
        let customSectionsClone = cloneAbstractControl(data);
        customSections.push(customSectionsClone);
        data.reset();
        break;
      case 'personalDetailsCustomSection':
        let personalDetailsCustomSection = this.userContent.get('personalDetails').get('customSections') as FormArray;
        let personalDetailsCustomSectionClone = cloneAbstractControl(data);
        personalDetailsCustomSection.push(personalDetailsCustomSectionClone);
        data.reset();
        break;
      case 'deleteLanguage':
        let languageData = this.userContent.get('language').get('entries') as FormArray;
        for (let i = 0; i < languageData.length; i++) {
          if (languageData.at(i).get('id').value == data.id) {
            languageData.removeAt(i);
          }
        }
        break;
      case 'deleteSkill':
        let skillData = this.userContent.get('skills').get('entries') as FormArray;
        for (let i = 0; i < skillData.length; i++) {
          if (skillData.at(i).get('id').value == data.id) {
            skillData.removeAt(i);
          }
        }
        break;
      case 'deleteEmployment':
        let employmentData = this.userContent.get('professionalExperience').get('entries') as FormArray;
        for (let i = 0; i < employmentData.length; i++) {
          if (employmentData.at(i).get('id').value == data.id) {
            employmentData.removeAt(i);
          }
        }
        break;
      case 'deleteEducation':
        let educationtData = this.userContent.get('education').get('entries') as FormArray;
        for (let i = 0; i < educationtData.length; i++) {
          if (educationtData.at(i).get('id').value == data.id) {
            educationtData.removeAt(i);
          }
        }
        break;
      case 'deleteCustomSection':
        let customSectionData = this.userContent.get('customSections') as FormArray;

        for (let i = 0; i < customSectionData.length; i++) {
          if (customSectionData.at(i).get('id').value == data.mainSection.id) {
            for (let j = 0; j < (customSectionData.at(i).get('details') as FormArray).length; j++) {
              if ((customSectionData.at(i).get('details') as FormArray).at(j).get('id').value == data.section.id) {
                (customSectionData.at(i).get('details') as FormArray).removeAt(j);
              }
            }
          }
        }
        break;
      case 'editLanguage':
        let languageFormData = this.userContent.get('language').get('entries') as FormArray;
        for (let i = 0; i < languageFormData.length; i++) {
          if (languageFormData.at(i).get('id').value == data.get('id').value) {
            languageFormData.at(i).get('name').patchValue(data.get('name').value);
            languageFormData.at(i).get('writingSkills').patchValue(data.get('writingSkills').value);
            languageFormData.at(i).get('speakingSkills').patchValue(data.get('speakingSkills').value);
            languageFormData.at(i).get('description').patchValue(data.get('description').value);
            languageFormData.at(i).get('showDetails').patchValue(data.get('showDetails').value);
            break;
          }
        }
        break;
      case 'editSkill':
        let skillFormData = this.userContent.get('skills').get('entries') as FormArray;
        for (let i = 0; i < skillFormData.length; i++) {
          if (skillFormData.at(i).get('id').value == data.get('id').value) {
            skillFormData.at(i).get('name').patchValue(data.get('name').value);
            skillFormData.at(i).get('level').patchValue(data.get('level').value);
            skillFormData.at(i).get('showSkillLevel').patchValue(data.get('showSkillLevel').value);
            break;
          }
        }
        break;
      case 'editWork':
        let professionalExperienceData = this.userContent.get('professionalExperience').get('entries') as FormArray;

        for (let i = 0; i < professionalExperienceData.length; i++) {
          if (professionalExperienceData.at(i).get('id').value == data.get('id').value) {
            professionalExperienceData.at(i).get('employerName').patchValue(data.get('employerName').value);
            professionalExperienceData.at(i).get('jobTitle').patchValue(data.get('jobTitle').value);
            professionalExperienceData.at(i).get('city').patchValue(data.get('city').value);
            professionalExperienceData.at(i).get('country').patchValue(data.get('country').value);
            professionalExperienceData.at(i).get('department').patchValue(data.get('department').value);
            professionalExperienceData.at(i).get('startedAt').patchValue(data.get('startedAt').value);
            professionalExperienceData.at(i).get('endedAt').patchValue(data.get('endedAt').value);
            professionalExperienceData.at(i).get('description').patchValue(data.get('description').value);
            professionalExperienceData.at(i).get('id').patchValue(data.get('id').value);
            if (professionalExperienceData.at(i).get('present'))
              professionalExperienceData.at(i).get('present').patchValue(data.get('present').value);
            break;
          }
        }
        break;
      case 'editEducation':
        let educationData = this.userContent.get('education').get('entries') as FormArray;
        for (let i = 0; i < educationData.length; i++) {
          if (educationData.at(i).get('id').value == data.get('id').value) {
            educationData.at(i).get('schoolName').patchValue(data.get('schoolName').value);
            educationData.at(i).get('schoolName2').patchValue(data.get('schoolName2').value);
            educationData.at(i).get('studiesName').patchValue(data.get('studiesName').value);
            educationData.at(i).get('degree').patchValue(data.get('degree').value);
            educationData.at(i).get('city').patchValue(data.get('city').value);
            educationData.at(i).get('country').patchValue(data.get('country').value);
            educationData.at(i).get('startedAt').patchValue(data.get('startedAt').value);
            educationData.at(i).get('endedAt').patchValue(data.get('endedAt').value);
            educationData.at(i).get('description').patchValue(data.get('description').value);
            educationData.at(i).get('id').patchValue(data.get('id').value);
            educationData.at(i).get('present').patchValue(data.get('present').value);
            break;
          }
        }
        break;
    }
  }


  addLanguage(operation) {
    if (operation == 'new') {
      this.addEntry('language', this.languageForm);
      this.closeLanguageForm();
    } else if (operation == 'edit') {
      this.addEntry('editLanguage', this.languageForm);
      this.closeLanguageEditForm();
    }
  }


  addEmployment(operation) {
    if (operation == 'new') {
      this.addEntry('work');
      this.closeEmploymentForm();
    } else if (operation == 'edit') {
      this.addEntry('editWork', this.professionalExperienceEntry);
      this.closeEmploymentEditForm()
    }
  }

  addEducation(operation) {
    if (operation == 'new') {
      this.addEntry('education');
      this.closeEducationForm();
    } else if (operation == 'edit') {
      this.addEntry('editEducation', this.educationHistoryEntry);
      this.closeEducationEditForm()
    }
  }

  addSkill(operation) {
    if (operation == 'new') {
      this.addEntry('name', this.skillForm);
      this.closeSkillForm();
    } else if (operation == 'edit') {
      this.addEntry('editSkill', this.skillForm);
      this.closeSkillEditForm();
    }
  }

  addCustomSection() {
    const dialogRef = this._dialog.open(CustomSectionComponent, {
      disableClose: true,
      width: '530px'
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.addEntry('customSections', res);
      }
    });
  }

  addNewCustomSectionEntry(data?) {
    const dialogRef = this._dialog.open(CustomSectionEntryComponent, {
      disableClose: true,
      data: data ? data : null,
      width: '530px'
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        let customSections = this.userContent.get('customSections') as FormArray;
        let index;
        for (let i = 0; i < customSections.value.length; i++) {
          if (customSections.value[i].id == res.sectionDetails.mainSection.id) {
            index = i;
          }
        }
        let sectionGroup = customSections.at(index) as FormGroup;
        let customSectionsEntryClone = cloneAbstractControl(res.entryData);
        let sectionArray = sectionGroup.controls.details as FormArray;
        if (data.operation == 'new') {
          sectionArray.push(customSectionsEntryClone)
        } else {
          for (let counter = 0; counter < sectionArray.length; counter++) {
            if (sectionArray.at(counter).get('id').value === customSectionsEntryClone.get('id').value) {

              sectionArray.at(counter).get('id').patchValue(customSectionsEntryClone.get('id').value)
              sectionArray.at(counter).get('title').patchValue(customSectionsEntryClone.get('title').value)
              sectionArray.at(counter).get('subtitle').patchValue(customSectionsEntryClone.get('subtitle').value)
              sectionArray.at(counter).get('city').patchValue(customSectionsEntryClone.get('city').value)
              sectionArray.at(counter).get('country').patchValue(customSectionsEntryClone.get('country').value)
              sectionArray.at(counter).get('date').patchValue(customSectionsEntryClone.get('date').value)
              sectionArray.at(counter).get('description').patchValue(customSectionsEntryClone.get('description').value)

            }
          }
        }

        res.entryData.reset();
      }
    });
  }

  updateResumePageBounds(bond, value) {
    this.resumePageBondsCopy[bond] = value;
    this.globalStore.dispatch(updateResumePageBounds({ data: this.resumePageBondsCopy }));
  }

  enableMoment(response) { 
    if (!response.event.checked) {
      response.data.get('startedAt').patchValue(moment());
      response.data.get('endedAt').patchValue(moment());
    }
  }

  addCustomPersonalDetails(item, index) {
    this.personalDetailsCustomSections.splice(index, 1);

    this.addEntry('personalDetailsCustomSection', new FormGroup({
      id: new FormControl(item.id),
      icon: new FormControl(item.icon),
      name: new FormControl(item.value),
      value: new FormControl(''),
      frValue: new FormControl(item.frValue),
      enValue: new FormControl(item.enValue)
    }));
  }

  get personalDetailsControlArray(): FormArray {
    return <FormArray>this.userContent.get('personalDetails').get('customSections');
  }

  deleteTableRow(type, element) {
    switch (type) {
      case 'language':
        this.addEntry('deleteLanguage', element);
        break;
      case 'name':
        this.addEntry('deleteSkill', element);
        break;
      case 'employment':
        this.addEntry('deleteEmployment', element);
        break;
      case 'education':
        this.addEntry('deleteEducation', element);
        break;
      case 'customSection':
        this.addEntry('deleteCustomSection', element);
        break;

    }
  }

  editTableRow(type, element) {
    switch (type) {
      case 'language':
        this.showLanguageEditForm = true;
        this.languageForm.get('name').patchValue(element.name);
        this.languageForm.get('writingSkills').patchValue(element.writingSkills);
        this.languageForm.get('speakingSkills').patchValue(element.speakingSkills);
        this.languageForm.get('description').patchValue(element.description);
        this.languageForm.get('showDetails').patchValue(element.showDetails);
        this.languageForm.get('id').patchValue(element.id);
        break;
      case 'name':
        this.showSkillEditForm = true;
        this.skillForm.get('name').patchValue(element.name);
        this.skillForm.get('level').patchValue(element.level);
        this.skillForm.get('showSkillLevel').patchValue(element.showSkillLevel);
        this.skillForm.get('id').patchValue(element.id);
        break;
      case 'employment':
        this.showEmploymentEditForm = true;
        this.professionalExperienceEntry.get('employerName').patchValue(element.employerName);
        this.professionalExperienceEntry.get('jobTitle').patchValue(element.jobTitle);
        this.professionalExperienceEntry.get('department').patchValue(element.department);
        this.professionalExperienceEntry.get('city').patchValue(element.city);
        this.professionalExperienceEntry.get('country').patchValue(element.country);
        this.professionalExperienceEntry.get('startedAt').patchValue(element.startedAt);
        this.professionalExperienceEntry.get('endedAt').patchValue(element.endedAt);
        this.professionalExperienceEntry.get('description').patchValue(element.description);
        this.professionalExperienceEntry.get('id').patchValue(element.id);
        if (this.professionalExperienceEntry.get('present'))
          this.professionalExperienceEntry.get('present').patchValue(element.present);
        break;
      case 'education':
        this.showEducationEditForm = true;
        this.educationHistoryEntry.get('schoolName').patchValue(element.schoolName);
        this.educationHistoryEntry.get('schoolName2').patchValue(element.schoolName2);
        this.educationHistoryEntry.get('studiesName').patchValue(element.studiesName);
        this.educationHistoryEntry.get('degree').patchValue(element.degree);
        this.educationHistoryEntry.get('city').patchValue(element.city);
        this.educationHistoryEntry.get('country').patchValue(element.country);
        this.educationHistoryEntry.get('startedAt').patchValue(element.startedAt);
        this.educationHistoryEntry.get('endedAt').patchValue(element.endedAt);
        this.educationHistoryEntry.get('description').patchValue(element.description);
        this.educationHistoryEntry.get('present').patchValue(element.present);
        this.educationHistoryEntry.get('id').patchValue(element.id);
        break;
      case 'customSection':
        this.addNewCustomSectionEntry(element)
        break;
    }
  }


  //Functions for Closing or opening Forms

  closeSkillForm() {
    this.skillForm.reset();
    this.showSkillForm = false;
  }

  closeSkillEditForm() {
    this.skillForm.reset();
    this.showSkillEditForm = false;
  }

  closeLanguageForm() {
    this.languageForm.reset();
    this.showLanguageForm = false;
  }

  closeLanguageEditForm() {
    this.languageForm.reset();
    this.showLanguageEditForm = false;
  }

  closeEmploymentForm() {
    this.professionalExperienceEntry.reset();
    this.showEmploymentForm = false;
  }

  closeEmploymentEditForm() {
    this.professionalExperienceEntry.reset();
    this.showEmploymentEditForm = false;
  }

  closeEducationForm() {
    this.educationHistoryEntry.reset();
    this.showEducationForm = false;
  }

  closeEducationEditForm() {
    this.educationHistoryEntry.reset();
    this.showEducationEditForm = false;
  }

  actionSuccess($event, mainSection) {
    let customSections = this.userContent.get('customSections') as FormArray;
    let index;
    for (let i = 0; i < customSections.value.length; i++) {
      if (customSections.value[i].id == mainSection.id) {
        index = i;
      }
    }
    let sectionGroup = customSections.at(index) as FormGroup;

    this.updateSectionOrderElement(mainSection.name, $event.value);
    sectionGroup.get('name').patchValue($event.value);
    this.changeRef.detectChanges();
  }

  actionSuccessEdit($event, sectionName) {
    this.updateSectionOrderElement(sectionName, $event.value);
    this.userContent.get(sectionName).get('displayName').patchValue($event.value);
    this.changeRef.detectChanges();
  }

  updateSectionOrderElement(prevName, newName) {
    let sectionOrder = this.resumePageBondsCopy.sectionOrder;
    // let itemIndex = sectionOrder.indexOf(prevName);
    sectionOrder.forEach((section, index) => {
      if (section.sectionType == prevName) {
        sectionOrder[index].displayName = newName;
      }
    })
    // if (itemIndex !== -1) {
    //   sectionOrder[itemIndex] = newName;
    // }
    this.globalStore.dispatch(updateResumePageBounds({ data: this.resumePageBondsCopy }));
  }

  openPictureEditor() {
    const dialogRef = this._dialog.open(PictureEditorComponent, {
      disableClose: true,
      width: '80%',
      height: '90%'
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.changeRef.detectChanges();
      }
    });
  }

  deleteImage() {
    this.resumePageBondsCopy.image = null;
    this.globalStore.dispatch(updateResumePageBounds({ data: this.resumePageBondsCopy }));
  }

  navigateToDesignModule() {
    this.router.navigate(['dashboard/design-template']);
  }

  ngOnDestroy(): void {
    this.changeRef.detach();
  }

  isDataSaved() {
    let result = Observable.create((observer) => {
      if (this.userContent.dirty) {
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
      }
      else {
        observer.next(true)
      }
    })
    return result.pipe(map(res => res));
  }

    calculateProfileCompleteness(data) {
      this.profileCompletenessPercentage = 0;
      if(data.personalDetails.firstName.length > 3 || data.personalDetails.firstName.length > 3) {
        this.profileCompletenessPercentage += 10;
      }
      if(this.validateEmail(data.personalDetails.email)) {
        this.profileCompletenessPercentage += 5;
      }
      if(data.personalDetails.phone.length > 5) {
        this.profileCompletenessPercentage += 5;
      }
      if(data.profileSummary.content) {
        let content = data.profileSummary.content.replace(/(<([^>]+)>)/ig, '');
        if(content.length > 0 && content.length < 31) {
          this.profileCompletenessPercentage += 10;
        }else if (content.length > 30) {
          this.profileCompletenessPercentage += 20;
        }
      }
      if(data.skills.entries.length > 0) {
        this.profileCompletenessPercentage += 10;
      }
      if(data.language.entries.length > 0) {
        this.profileCompletenessPercentage += 10;
      }
      if(data.education.entries.length > 0) {
        this.profileCompletenessPercentage += 10;
      }
      if(data.professionalExperience.entries.length > 0) {
        
        let firstJob = data.professionalExperience.entries[0];
        if(firstJob.description) {
          let firstJobDescription = firstJob.description.replace(/(<([^>]+)>)/ig, '');
          if(firstJobDescription.length > 20) {
            this.profileCompletenessPercentage += 10;
          }
        }

        let secondJob = data.professionalExperience.entries[1];
        if(secondJob) {
          if(secondJob.description) {
            let secondJobDescription = secondJob.description.replace(/(<([^>]+)>)/ig, '');
            if(secondJobDescription.length > 20) {
              this.profileCompletenessPercentage += 10;
            }
          }

        }
      }

      if(data.customSections.length > 0) {
        let firstCustomSectionEntry = data.customSections[0].details;
        if(firstCustomSectionEntry) {
          if(firstCustomSectionEntry.length > 0) {
            this.profileCompletenessPercentage += 10;
          }
        }
      }
     
    }


     validateEmail(email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
  }
}

