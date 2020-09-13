export interface UserContent {
    id?: string;
    cvName : string;
    personalDetails: PersonalDetails;
    profileSummary: profileSummary;
    professionalExperience: ProfessionalExperience;
    education: Education;
    language: Language;
    skills: Skill,
    customSections: CustomSection[];
}


export interface profileSummary {
    displayName: string;
    frDisplayName: string;
    sectionType: string;
    content : string;
}

export interface PersonalDetails {
    namePrefix: string;
    firstName: string;
    middleName: string;
    lastName: string;
    addressLineOne: string;
    addressLineTwo: string;
    city: string;
    country: string;
    phone: string;
    email: string;
    postalCode: string;
    customSections: PersonalDetailsCustomSection[];
}

export interface PersonalDetailsCustomSection {
      id: string
      frValue: string
      enValue: string
      icon : string
      value: string
}

export interface ProfessionalExperience {
    displayName: string;
    sectionType: string;
    frDisplayName: string;
    entries : professionalExpData[];
}

export interface Education {
    displayName: string;
    sectionType: string;
    frDisplayName: string;
    entries : educationData[];
}

export interface Language {
    displayName: string;
    frDisplayName: string;
    sectionType: string;
    entries : languageData[];
}

export interface Skill {
    displayName: string;
    frDisplayName: string;
    sectionType: string;
    entries : skillsData[];

}

export interface CustomSection {
    name: string;
    details: {
        title: string;
        subtitle: string;
        city: string;
        country: string;
        date: string;
        description: string;
    }
}

export interface professionalExpData {
    employerName: string;
    jobTitle: string;
    department: string;
    city: string;
    country: string;
    startedAt: Date;
    endedAt: Date;
    description: string;
    id: string;
    present: boolean;
}

export interface educationData {
    schoolName: string;
    schoolName2: string;
    studiesName: string;
    degree: string;
    city: string;
    country: string;
    startedAt: Date;
    endedAt: Date;
    description: string;
    id : string;
    present: boolean;
}

export interface languageData {
    name: string;
    writingSkills: string;
    speakingSkills: string;
    description: string;
    showDetails: boolean;
    id: string;
}

export interface skillsData {
    name: string;
    level: string;
    showSkillLevel: boolean;
    id: string;
}