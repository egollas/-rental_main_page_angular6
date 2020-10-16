export interface SiteContact {
    name: string;
    email: string;
    message: string;
    phone: string;
    property_code?: string;
    subject?: string;
    start?: string;
    end?: string;
    children?: number;
    adults?: number;
    profile?: ContactProfile;
}

export interface ContactProfile {
    interest: string;
    property_type: string;
    max_value?: number;
    bedrooms?: number;
    description?: string;
}
export interface JoinInUs {
    name: string;
    email: string;
    zipcode: string;
    address: string;
    address_complement: string;
    neighborhood: string;
    city: string;
    state: string;
    phone?: string;
    cellphone?: string;
    country: string;
    areaInterest?: string;
    professionalExperience: string;
}
