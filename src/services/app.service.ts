import { Injectable } from '@angular/core';
import { LayoutType } from '../interfaces/layoutType';

@Injectable()
export class AppService {

    constructor() { }

    apiUrl(): string {
        return 'https://api2.imobzi.app/v1';
    }

    namespace(): string {
        return 'ac-pamh1810123k2g';
    }

    clientBucketPath(): string {
        return `https://imobzi.storage.googleapis.com/accounts/${this.namespace()}/public`;
    }

    layoutBucketPath(): string {
        return 'https://imobzi.storage.googleapis.com';
    }

    /*
        1 Home: 'map', 'fixed', 'banner'
        2 Home: 'realtors', 'highlight-footer'
        3 Map Search: boolean
    */
    layoutType (): LayoutType {
        return { layout: 'map', footer: 'realtors', search_map: true   };
    }

}
