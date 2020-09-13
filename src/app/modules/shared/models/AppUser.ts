export interface AppUser {
    locale: string;
    role: string;
    timeZone: string;
    email: string;
    id: string;
    firstName?: any;
    lastName?: any;
    middleName?: any;
    title?: any;
    addressLine1?: any;
    addressLine2?: any;
    city?: any;
    province?: any;
    postalCode?: any;
    country?: any;
    birthdate?: any;
    maritalStatus?: any;
    gender?: any;
    cellPhoneNumber?: any;
    homePhoneNumber?: any;
    registeredAt: Date;
    lastLoggedInAt?: any;
    website?: any;
    drivingLicence?: any;
    socialMedia: any[];
}
