import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { IIntegration } from '../interfaces/integration';
import { AppService } from './app.service';
import { RequestService } from './request.service';


@Injectable()
export class IntegrationService {

    constructor(
        private _app: AppService,
        private _request: RequestService
    ) { }

    getIntegrationByName(integrationName: string): Observable<IIntegration> {
        return new Observable<IIntegration>(observer => {
            this._request.get(
                `${this._app.apiUrl()}/${this._app.namespace()}/site/integration/${integrationName}`).subscribe(
                response => observer.next(response['integration']),
                () => observer.error('error_on_get_integration'),
                () => observer.complete()
            );
        });
    }

}
