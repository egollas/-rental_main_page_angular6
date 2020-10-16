import { ICity } from './city';

export interface INeighborhood {
    active: boolean;
    city?: ICity;
    db_id: string;
    name: string;
    neighborhood_idx: string;
    zone: string;
}
