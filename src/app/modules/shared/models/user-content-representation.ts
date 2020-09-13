import { ProfessionalExperience, Language, Education, Skill, CustomSection, profileSummary } from './user-content';

export interface UserContentRepresentation {
      personalDetails : PersonalDetails;
      profileSummary : profileSummary;
      professionalExperience: ProfessionalExperience;
      summaryContentEntered : boolean;
      education : Education;
      language: Language;
      skills : Skill;
      customSections: CustomSection[];
}


export interface PersonalDetails {
    namePrefix :string;
    name :string;
    address :string;
    mobile :string;
    email :string;
    customSections: any[];
    addressLineOne : string,
    addressLineTwo: string,
    city: string,
    country: string,
    postalCode: string
}

export interface ResumePageBounds {
    displayIcons: boolean;
    templateId?: string;
    currentHeight : number;
    headerLayout : number;
    enablePicture: boolean;
    enableTitlePrefix: boolean;
    pictureDisplayStyle: number;
    columnType: number;
    dateFormat : DateFormat;
    image: any;
    formatting: PageFormatting;
    colors: CVColors;
    file: file;
    fontFamily: string;
    sectionOrder: any[];
    towColumnsSections: TwoColumnsSection;
    columns: ColumnsFormatting;
}

export interface TwoColumnsSection {
    leftColumnOrder : any[];
    rightColumnOrder: any[];
}

export interface ColumnsFormatting {
        leftWidth: number;
        rightWidth: number;
        leftBackground: string;
        rightBackground: string;
        leftFontColor: string;
        rightFontColor: string;
}

export interface DateFormat {
    yearFormat: string;
    monthFormat: string;
    separator: string;
}

export interface CVColors {
    headerBackground: string;
    headerColor: string;
    titleColor: string;
    bodyFontColor: string;
    borderColor: string;
    bodyBackground: string;
}

export interface PageFormatting {
    headerLineSize: number;
    headerFontSize: number;
    titleFontSize: number;
    bodyFontSize: number;
    borderWidth: number;
    textSpacing: number;
    sectionSpacing: number;
    horizontalMargin: number;
    verticalMargin: number;
    sectionLineWidth: number;
    sectionLineThickness: number
    sectionLineAlignment: string;
    pageFormat: string;
}


export interface file {
    originalName: string;
    bytes: string;
    mime: string;
    customerId: string;
    id: string;
    name: string;
    companyId: string;
}