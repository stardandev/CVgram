export interface CoverLetter{
    id?: string;
    body :string;
    companyAddress :string;
    companyName :string;
    coverLetterTemplateId :string;
    createdAt :Date;
    customerId :string;
    email :string;
    footer :string;
    header :string;
    hiringManager :string;
    name :string;
    type: string;
    applicantName: string;
    applicantPhoneNumber: string;
    applicantAddress: string;
    re: string;
}

export interface CoverLetterTemplate {
    id  :string;
    content  :any;
    customerId  :string;
    name  :string;
}