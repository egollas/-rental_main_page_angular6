export interface Parameters {
    address: string;
    address_complement: string;
    neighborhood: string;
    city: string;
    creci: string;
    state: string;
    company_name: string;
    company_type: string;
    description: string;
    email: string;
    logotype_image_url: string;
    zip_code: string;
    site_copyright: string;
    site_title: string;
    site_meta_description: string;
    phone: Array<Phone>;
    social_networks?: Array<SocialNetwork>;
    longitude: number;
    latitude: number;
}

export interface Phone {
    number: string;
    country_code: string;
    type: string;
}

export interface SocialNetwork {
    account: string;
    name: string;
}
