import { Observable } from 'rxjs/Observable';
import { INeighborhood } from '../interfaces/neighborhood';
import { Property, PropertyType, SearchAvailabilityTypes } from '../interfaces/property';
import { PropertyTypeHighlight } from '../interfaces/typehighlight';

const typespotlight: PropertyTypeHighlight = {
    name: 'Casa/Sobrado',
    count: 8
};

const typespotlights: PropertyTypeHighlight[] = [
    typespotlight,
    typespotlight,
    typespotlight,
    typespotlight,
    typespotlight,
    typespotlight,
    typespotlight,
    typespotlight
];
const neighborhood: INeighborhood = {
    active: true,
    db_id: 'db_id',
    name: 'Santo Amaro',
    neighborhood_idx: 'neighborhood_idx',
    zone: '',
    city: {
        name: 'São Paulo',
        country: 'Brasil',
        administrative_area_level_1: 'SP',
        db_id: ''
    }
};

const propertyMock: Property = {
    db_id: '2dsffcf32',
    zipcode: '11',
    address: 'Rua Boa Vista, 12',
    address_complement: '',
    area: 150,
    bathroom: 3,
    bedroom: 2,
    building: false,
    building_name: '',
    city: 'São Paulo',
    code: '2',
    country: 'Brasil',
    description: 'Um imóvel',
    garage: 1,
    high_standard: false,
    active: true,
    latitude: 20,
    longitude: 10,
    lot_area: 150,
    neighborhood: 'Eliana',
    property_type: 'Casa',
    finality: 'Apartamento',
    rental_value: 1500,
    sale_value: 200000,
    site_description: '',
    site_meta_description: 'Casa para alugar',
    site_publish: true,
    site_publish_price: true,
    site_title: 'Meu titulo padrão',
    site_url: 'www',
    state: 'SP',
    status: 'disponivel',
    suite: 2,
    tags: ['sale'],
    useful_area: 150,
    vacation_rental: false,
};

export class PropertyServiceMock {

    public getTypeHighlights(): Observable<PropertyTypeHighlight[]> {
        return new Observable<PropertyTypeHighlight[]>(observer => {
            observer.next(
                typespotlights
            );
            observer.complete();
        });
    }

    public getProperty(propertyCode: string): Observable<Property> {
        return new Observable<Property>(observer => {
            observer.next(propertyMock);
        });
    }

    public updateSiteCount(propertyCode: string) {    }


    public getPropertyByUrl(propertyUrl: string): Observable<Property> {
        return new Observable<Property>(observer => {
            observer.next(propertyMock);
        });
    }

    public getPropertiesRelated(propertyCode: string): Observable<Array<Property>> {
        return new Observable<Array<Property>>(observer => {
            observer.next([propertyMock]);
        });
    }

    public searchPropertyTypes(): Observable<SearchAvailabilityTypes> {
        return new Observable<SearchAvailabilityTypes>(observer => {
            const availabilityTypes: SearchAvailabilityTypes = <SearchAvailabilityTypes>{};
            const type: PropertyType = <PropertyType>{};
            type.property_type = 'Apartamento';
            type.finality = 'Residential';
            availabilityTypes.buy = [type, type];
            availabilityTypes.rent = [type, type];
            observer.next(availabilityTypes);
            observer.complete();
        });
    }

    public propertyNeighborhoods(): Observable<INeighborhood[]> {
        return new Observable<INeighborhood[]>(observer => {
            observer.next([neighborhood]);
            observer.complete();
        });
    }

}

