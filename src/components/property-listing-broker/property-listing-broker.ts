import { Component, Input } from '@angular/core';
import { Realtor } from '../../interfaces/realtor';
import { AppService } from '../../services/app.service';

@Component({
    selector: 'property-listing-broker',
    templateUrl: './property-listing-broker.html',
    styleUrls: ['./property-listing-broker.scss']
})

export class PropertyListingBrokerComponent {

    @Input() listingBroker: Realtor;

    constructor(
        private _app: AppService
    ) { }

    realtorImgErrorHandler(event) {
        event.target.onerror = null;
        event.target.src = `${this._app.layoutBucketPath()}/image/realtor-image.jpg`;
    }

    listingBrokerSearch() {
        localStorage.removeItem('search_params');
    }
}
