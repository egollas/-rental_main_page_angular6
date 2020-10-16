import { Realtor } from './realtor';

export class Property {
    db_id: string;
    zipcode: string;
    address: string;
    address_complement: string;
    area: number;
    bathroom: number;
    bedroom: number;
    building: Boolean;
    building_name: string;
    built?: number;
    city: string;
    code?: string;
    country: string;
    created_at?: string;
    database?: string;
    description: string;
    features?: any;
    fields?: {
        additional_values: Array<Fields>;
    };
    garage: number;
    high_standard: boolean;
    active: boolean;
    latitude: number;
    longitude: number;
    lot_area: number;
    measure_type?: string;
    nearby?: Array<string>;
    neighborhood: string;
    property_situation?: string;
    property_type: string;
    finality: string;
    rental_value: number;
    sale_value: number;
    site_description: string;
    site_meta_description: string;
    site_publish: Boolean;
    site_publish_price: Boolean;
    site_title: string;
    site_url: string;
    stage?: string;
    state: string;
    status: string;
    suite: number;
    sun_position?: string;
    tags: Array<string>;
    useful_area: number;
    vacation_rental: boolean;
    visit_only_realtor?: boolean;
    visit_time?: string;
    multimidias?: Array<PropertyMultimidia>;
    photos?: Array<PropertyPhoto>;
    listing_broker?: Realtor;
    calendar?: Array<PropertyCalendar>;
    cover_photo?: {
        url: string;
    };
}

export interface PropertyHighlights {
    [key: string]: Array<Property>;
}

export interface Fields {
    field_id: string;
    name: string;
    position: string;
    required: boolean;
    value: number;
}

export interface PropertyHighlightsResult {
    highlights: PropertyHighlights;
    properties_map: Array<Property>;
}

export interface PropertyPhoto {
    category: string;
    db_id: number;
    description: string;
    position: number;
    url: string;
}

export interface PropertyMultimidia {
    category: string;
    db_id: number;
    description: string;
    position: number;
    url: string;
    thumbnail?: string;
}


export interface PropertyCalendar {
    initial_date: string;
    final_date: string;
    observation: string;
    event_type: string;
    db_id: string;
}


export interface PropertySearchResult {
    properties: {
        count: number;
        cursor: string;
        properties: Array<Property>;
    };
    properties_map?: Array<Property>;
}

export interface PropertySearchResultFields {
    availability?: {
        rent: number;
        buy: number;
        vacation_rental: number;
    };
    cities?: {
        [key: string]: number;
    };
    neighborhoods?: {
        [key: string]: number;
    };
    property_types?: {
        [key: string]: number;
    };
    areas?: {
        [key: string]: number;
    };
    values?: {
        min: number;
        max: number;
    };
    bedrooms?: {
        [key: string]: number;
    };
    suites?: {
        [key: string]: number;
    };
    garages?: {
        [key: string]: number;
    };
}

export interface SearchAvailabilityTypes {
    vacation_rental: Array<PropertyType>;
    rent: Array<PropertyType>;
    buy: Array<PropertyType>;
}

export interface AdvertisePropertyType {
    finality: string;
    type: string;
}

export interface PropertyType {
    finality: string;
    property_type: string;
}

export interface PropertySearchPagination {
    totalItems: number;
    currentPage: number;
    pageSize: number;
    totalPages: number;
    startPage: number;
    endPage: number;
    pages?: Array<Number>;
}
