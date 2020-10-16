import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { INeighborhood } from '../interfaces/neighborhood';
import { AdvertisePropertyType, Property, PropertyHighlightsResult, PropertySearchResult, PropertySearchResultFields, SearchAvailabilityTypes } from '../interfaces/property';
import { SearchParams } from '../interfaces/search-params';
import { PropertyTypeHighlight } from '../interfaces/typehighlight';
import { AppService } from './app.service';
import { RequestService } from './request.service';

@Injectable()
export class PropertyService {

    constructor(
        private _app: AppService,
        private _request: RequestService
    ) { }

    public getHighlights(showMap = true): Observable<PropertyHighlightsResult> {
        return new Observable<PropertyHighlightsResult>(observer => {
            const params = (showMap) ? '' : 'show_map=false';
            this._request.get<PropertyHighlightsResult>(
                `${this._app.apiUrl()}/${this._app.namespace()}/site/properties`, params).subscribe(
                    response => observer.next(response),
                    error => observer.error('Erro: ' + error)
                );
        });
    }

    public getTypeHighlights(): Observable<PropertyTypeHighlight[]> {
        return new Observable<PropertyTypeHighlight[]>(observer => {
            this._request.get<PropertyTypeHighlight[]>(
                `${this._app.apiUrl()}/${this._app.namespace()}/site/highlights/types`).subscribe(
                    response => observer.next(response),
                    error => observer.error('Erro: ' + error)
                );
        });
    }

    public getPropertyTypes(): Observable<AdvertisePropertyType[]> {
        return new Observable<AdvertisePropertyType[]>(observer => {
            this._request.get<AdvertisePropertyType[]>(
                `${this._app.apiUrl()}/${this._app.namespace()}/site/properties/search/property-type`).subscribe(
                    response => observer.next(response),
                    error => observer.error('Erro: ' + error)
                );
        });
    }

    public searchProperties(params: SearchParams): Observable<PropertySearchResult> {
        let paramsString: string = this.getSearchParams(params);
        history.replaceState(null, null, `${window.location.pathname}?${paramsString}`);
        if (params.cursors[params.page - 1] === undefined) {
            params.cursors[params.page - 1] = '';
        }
        paramsString += `&cursor=${params.cursors[params.page - 1]}&direction=${params.direction}`;
        return new Observable<PropertySearchResult>(observer => {
            this._request.get<PropertySearchResult>(
                `${this._app.apiUrl()}/${this._app.namespace()}/site/properties/search`, paramsString).subscribe(
                    propertyResult => observer.next(propertyResult),
                    error => observer.error(error),
                    () => observer.complete()
                );
        });
    }

    public searchPropertyTypes(): Observable<SearchAvailabilityTypes> {
        return new Observable<SearchAvailabilityTypes>(observer => {
            this._request.get<SearchAvailabilityTypes>(
                `${this._app.apiUrl()}/${this._app.namespace()}/site/properties/search/fields`,
                'search_type=property_types').subscribe(
                    propertyResult => observer.next(propertyResult),
                    error => observer.error(error),
                    () => observer.complete()
                );
        });
    }

    public searchFields(params: SearchParams, filtersShowTotal: boolean,
        firstSearch: boolean = true): Observable<PropertySearchResultFields> {
        let paramsString: string = this.getSearchParams(params);
        if (firstSearch) { paramsString += '&all_fields=true'; }
        paramsString += `&filters_show_total=${filtersShowTotal}`;
        paramsString += '&search_type=filter';

        return new Observable<PropertySearchResultFields>(observer => {
            this._request.get<PropertySearchResultFields>(
                `${this._app.apiUrl()}/${this._app.namespace()}/site/properties/search/fields`, paramsString).subscribe(
                    propertyResult => observer.next(propertyResult),
                    error => observer.error(error),
                    () => observer.complete()
                );
        });
    }

    private getSearchParams(searchParams: SearchParams): string {
        let params = searchParams.order ? `order=${searchParams.order}` : `order=neighborhood`;
        // tslint:disable-next-line:forin
        for (const searchParam in searchParams) {
            if (searchParam !== 'order' && searchParams[searchParam]) {
                switch (searchParam) {
                    case 'availability':
                    case 'stage':
                    case 'show_map':
                    case 'nickname':
                        params += `&${searchParam}=${searchParams[searchParam]}`;
                        break;
                    case 'values':
                        if (searchParam === 'values' && searchParams.values.length === 2) {
                            params += `&value_min=${searchParams.values[0]}`;
                            params += `&value_max=${searchParams.values[1]}`;
                        }
                        break;
                    case 'neighborhoods':
                        if (searchParams.neighborhoods.length > 0) {
                            searchParams.neighborhoods.forEach(neighborhood => params += `&neighborhood=${neighborhood}`);
                        }
                        break;
                    case 'cities':
                        if (searchParams.cities.length > 0) {
                            searchParams.cities.forEach(city => params += `&city=${city}`);
                        }
                        break;
                    case 'propertyTypes':
                        if (searchParams.propertyTypes.length > 0) {
                            searchParams.propertyTypes.forEach(propertyType => params += `&property_type=${propertyType}`);
                        }
                        break;
                    case 'area':
                        if (searchParams.area.length > 0) {
                            searchParams.area.forEach(area => params += `&area=${area}`);
                        }
                        break;

                    case 'bedrooms':
                        if (searchParams.bedrooms.length > 0) {
                            searchParams.bedrooms.forEach(bedroom => params += `&bedroom=${bedroom}`);
                        }
                        break;
                    case 'suites':
                        if (searchParams.suites.length > 0) {
                            searchParams.suites.forEach(suite => params += `&suite=${suite}`);
                        }
                        break;
                    case 'garages':
                        if (searchParams.garages.length > 0) {
                            searchParams.garages.forEach(garage => params += `&garage=${garage}`);
                        }
                        break;
                    case 'feature':
                        if (searchParams.feature.length > 0) {
                            searchParams.feature.forEach(feature => params += `&feature=${feature}`);
                        }
                        break;
                    case 'finality':
                        if (searchParams.finality.length > 0) {
                            searchParams.finality.forEach(finality => params += `&finality=${finality}`);
                        }
                        break;
                }
            }
        }
        return params;
    }

    public propertyNeighborhoods(): Observable<INeighborhood[]> {
        return new Observable<INeighborhood[]>(observer => {
            this._request.get<INeighborhood[]>(
                `${this._app.apiUrl()}/${this._app.namespace()}/site/property-neighborhoods`).subscribe(
                    neighborhoods => observer.next(neighborhoods),
                    error => observer.error(error),
                    () => observer.complete()
                );
        });
    }

    public getProperty(propertyCode: string): Observable<Property> {
        return new Observable<Property>(observer => {
            this._request.get<Property>(
                `${this._app.apiUrl()}/${this._app.namespace()}/site/properties/${propertyCode}`).subscribe(
                    property => observer.next(property),
                    error => observer.error(error),
                    () => observer.complete()
                );
        });
    }

    public getPropertyByUrl(propertyUrl: string): Observable<Property> {
        return new Observable<Property>(observer => {
            this._request.get<Property>(
                `${this._app.apiUrl()}/${this._app.namespace()}/site/properties`, `url=${propertyUrl}`).subscribe(
                    property => observer.next(property),
                    error => observer.error(error),
                    () => observer.complete()
                );
        });
    }

    public getPropertiesRelated(propertyCode: string): Observable<Array<Property>> {
        return new Observable<Array<Property>>(observer => {
            this._request.get<Array<Property>>(
                `${this._app.apiUrl()}/${this._app.namespace()}/site/properties/${propertyCode}/related`).subscribe(
                    properties => observer.next(properties),
                    error => observer.error(error),
                    () => observer.complete()
                );
        });
    }

    public updateSiteCount(propertyCode: string) {
        this._request.get(`${this._app.apiUrl()}/${this._app.namespace()}/site/properties/${propertyCode}/views`).subscribe(
            () => { }
        );
    }

}
