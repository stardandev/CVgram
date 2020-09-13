import { Moment } from 'moment';

export interface resumeSchema {
    name: string;
    photoFileId: string;
    id?: string;
    abstract: string;
    activitiesSectionName: string;
    addressLine1: string;
    addressLine2: string;
    cellPhoneNumber: string;
    city: string;
    country: string;
    createdAt?: string;
    customerId?: string;
    cvTemplateId?: string;
    educationsSectionName: string;
    employmentsSectionName: string;
    firstName: string;
    homePhoneNumber: string;
    languagesSectionName: string;
    lastName: string;
    lastUpdatedAt?: string;
    lastViewedAt?: string;
    middleName: string;
    objective: string;
    postalCode: string;
    province: string;
    referencesSectionName: string;
    skillsSectionName: string;
    title: string;
    views?: number
    educations: educationSchema[];
    employments: employmentSchema[];
    activities: activitesSchema[];
    references: referencesSchema[];
    skills: skillsSchema[];
    languages: languageSchema[];
    customSections: any;
}


export interface educationSchema {
    cvId?: string;
    schoolName: string;
    schoolName2: string;
    studiesName: string;
    startedAt: any;
    endedAt: any;
    description: string;
    priority: number;
    id?: string;
    present : boolean;
    city: string;
    country: string;
}

export interface employmentSchema {
    cvId?: string;
    employerName: string;
    jobTitle: string;
    city: string;
    country: string;
    startedAt: any;
    department: string;
    endedAt: any;
    description: string;
    priority: number;
    id?: string;
    present : boolean;
}

export interface activitesSchema {
    cvId?: string;
    name: string;
    category: string;
    datePeriod: string;
    description: string;
    priority: number;
    id?: string;
}

export interface skillsSchema {
    cvId?: string;
    name: string;
    level: number;
    id?: string;
    description: string;
    priority: number;
    showSkillLevel? : boolean;
}

export interface languageSchema {
    id?: string;
    cvId?: string;
    name: string;
    writingSkills: string;
    speakingSkills: string;
    description: string;
    priority: number;
    showDetails? : boolean;
}

export interface referencesSchema {
    cvId?: string;
    description: string;
    priority: number;
}