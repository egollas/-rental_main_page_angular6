import { Component, Input } from '@angular/core';
import { Property } from '../../../interfaces/property';
import { AppService } from '../../../services/app.service';

@Component({
    selector: 'properties-related',
    templateUrl: './properties-related.html',
    styleUrls: ['./properties-related.scss']
})

export class PropertiesRelatedComponent {

    @Input() propertiesRelated: Array<Property>;
    public layoutBucketPath: string = this._app.layoutBucketPath();

    constructor(
        private _app: AppService
    ) {}

}
