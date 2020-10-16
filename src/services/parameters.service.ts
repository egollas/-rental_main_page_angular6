import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Parameters } from '../interfaces/parameters';
import { AppService } from './app.service';
import { RequestService } from './request.service';

@Injectable()
export class ParametersService {

    constructor(
            private _app: AppService,
            private _request: RequestService
    ) { }

    getParameters(): Observable<Parameters>  {
        return new Observable<Parameters>(observer => {
            this._request.get<Parameters>(`${this._app.apiUrl()}/${this._app.namespace()}/site/parameters`).subscribe(
                response => observer.next(response),
                error => observer.error('Erro: ' + error),
                () => observer.complete()
            );
        });
    }

}
