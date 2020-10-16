export interface IIntegration {
    db_id: number;
    name: string;
    active: boolean;
    api_key: string;
    google_maps?: IGoogleMaps;
    google_analytics?: IGoogleAnalytics;
}

export interface IGoogleMaps {
    location_type?: string;
    user_email?: string;
}

export interface IGoogleAnalytics {
    view_id?: string;
    view_url?: string;
    tracking_id?: string;
}
