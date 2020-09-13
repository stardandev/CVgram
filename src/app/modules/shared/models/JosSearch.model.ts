export class JobSearchModel {
    id: any;
    customerId: any;
    description: any;
    endedAt: any;
    name: any;
    startedAt: any;
}

export class JobTypeModel {
    id: any;
    name: any;
}

export class JobModel {
    id: any;
    companyId: any;
    contractType: any;
    createdAt: any;
    description: any;
    duration: any;
    isActive: boolean;
    isCompanyHidden: boolean;
    jobLocationId: any;
    jobTypeId: any;
    name: any;
    profile: any;
    salary: any;
    startsAt: any;
    studyLevel: any;
    company: CompanyModel;
}
export class JobSearchLead {
    id: any;
    category: any; // "contact taken", "interview process", "finalizing", "interested"
    createdAt: any;
    jobSearchId: any;
    name: any;
}
export class CompanyModel {
    id: any;
    description: any;
    establishedAt: any;
    industryId: any;
    managingCustomerId: any;
    name: any;
    website: any;
}
export class JobSearchLeadActionModel {
    id: any;
    createdAt: any;
    description: any;
    jobSearchLeadId: any;
    nextAction: any;
    nextActionRemindAt: any;
}