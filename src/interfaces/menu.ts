import { MenuCategory } from './menucategory';

export interface Menu {
    name: string;
    url: string;
    queryParams?: Object;
    submenus?: Array<Menu>;
}
