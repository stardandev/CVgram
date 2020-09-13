import { UserContent, skillsData } from './../models/user-content';
import { resumeSchema, educationSchema, employmentSchema, skillsSchema, languageSchema } from './Schemas/resume-schema';
import * as moment from 'moment';
import { UserContentRepresentation } from '../models/user-content-representation';

export class ResumeStructureBuilder {
  static createResumeStructure(userContent:UserContent, templateId, customerId, uploadedFile):resumeSchema {
    let jobTitle;
    userContent.personalDetails.customSections.forEach(value => {
        if(value.id.toString() == '1') {
          jobTitle == value.value;  
        }
    });
    let educations:educationSchema[] = [];
    userContent.education.entries.forEach(value => {
        educations.push({
            schoolName: value.schoolName,
            schoolName2: value.schoolName2,
            studiesName: value.degree,
            startedAt: moment(value.startedAt).toISOString(),
            endedAt: moment(value.endedAt).toISOString(),
            description : value.description,
            priority: 0,
            id : value.id,
            present : value.present,
            city : value.city,
            country: value.country
        })
    });
    let employments: employmentSchema[] = [];
    userContent.professionalExperience.entries.forEach(value => {
        employments.push({
            employerName: value.employerName,
            jobTitle : value.jobTitle,
            city :value.city,
            country :value.country,
            startedAt: moment(value.startedAt).toISOString(),
            endedAt: moment(value.endedAt).toISOString(),
            description : value.description,
            department: value.department,
            priority: 0,
            id : value.id,
            present: value.present
        })
    });
    let skills : skillsSchema[] = [];
    userContent.skills.entries.forEach(value => {
        skills.push({
            name: value.name,
            level : parseInt(value.level),
            description: '',
            priority: 0,
            id : value.id,
            showSkillLevel : value.showSkillLevel
        })
    });

    let languages : languageSchema[] = [];
    userContent.language.entries.forEach(value => {
        languages.push({
            name : value.name,
            writingSkills: value.writingSkills,
            speakingSkills: value.speakingSkills,
            description :value.description,
            priority : 0,
            id : value.id,
            showDetails : value.showDetails
        })
    })

    
    return {
            id : userContent.id ? userContent.id : '', 
            name : userContent.cvName,
            photoFileId: uploadedFile ? uploadedFile.id : null,
            customSections: userContent.customSections,
            abstract: '',
            activitiesSectionName : '',
            addressLine1 : userContent.personalDetails.addressLineOne,
            addressLine2 : userContent.personalDetails.addressLineTwo,
            cellPhoneNumber: userContent.personalDetails.phone,
            city : userContent.personalDetails.city,
            country : userContent.personalDetails.country,
            customerId : customerId,
            cvTemplateId : templateId,
            educationsSectionName: userContent.education.displayName,
            employmentsSectionName: userContent.professionalExperience.displayName,
            firstName : userContent.personalDetails.firstName,
            homePhoneNumber: userContent.personalDetails.phone,
            languagesSectionName: userContent.language.displayName,
            lastName: userContent.personalDetails.lastName,
            middleName : userContent.personalDetails.middleName,
            objective : userContent.profileSummary.content,
            postalCode : userContent.personalDetails.postalCode,
            province : '',
            referencesSectionName : "",
            skillsSectionName: userContent.skills.displayName,
            title: jobTitle,
            educations : educations,
            employments : employments,
            activities: [],
            references : [],
            skills: skills,
            languages : languages
        }
    }

    static createUserContentStructure(resume): UserContent {

      return {
        id: resume.id,
        cvName: resume.name,
        personalDetails : {
          namePrefix : "Mr",
          firstName: resume.firstName,
          middleName: resume.middleName,
          lastName: resume.lastName,
          addressLineOne: resume.addressLine1,
          addressLineTwo: resume.addressLine2,
          city: resume.city,
          country: resume.country,
          phone: resume.cellPhoneNumber,
          email: '',
          postalCode: resume.postalCode,
          customSections: []
        },
        profileSummary : {
          sectionType: 'profileSummary',
          displayName: 'Profile',
          frDisplayName: 'Profil',
          content: resume.objective
        },
        professionalExperience : {
          sectionType : 'professionalExperience',
          displayName : resume.employmentsSectionName,
          frDisplayName: 'Expérience professionnelle',
          entries: resume.employments
        },
        education: {
          sectionType : 'education',
          displayName: resume.educationsSectionName,
          frDisplayName: 'Éducation',
          entries : resume.educations
        },
        language : {
          sectionType : 'language',
          displayName: resume.languagesSectionName,
          frDisplayName: 'Langages',
          entries : resume.languages
        },
        skills : {
          sectionType : 'skills',
          displayName: resume.skillsSectionName,
          frDisplayName: 'Compétences',
          entries : resume.skills
        },
        customSections : resume.customSections
      }
    }
}
