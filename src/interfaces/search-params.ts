export class SearchParams {
    availability: string;
    order: string;
    cities: string[];
    neighborhoods: string[];
    nickname?: string;
    propertyTypes: string[];
    area?: string[];
    values: number[];
    bedrooms: number[];
    suites: number[];
    garages: number[];
    finality?: string [];
    feature?: string[];
    stage: string;
    page?: number;
    user_id?: number;
    show_map: boolean;
    cursor?: string;
    direction?: string;
    cursors?: string[];
}
