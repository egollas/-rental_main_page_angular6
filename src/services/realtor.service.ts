import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Realtor } from '../interfaces/realtor';
import { AppService } from './app.service';
import { RequestService } from './request.service';

@Injectable()
export class RealtorsService {

    constructor(
            private _app: AppService,
            private _request: RequestService
    ) { }

    getRealtors(): Observable<Realtor[]>  {
        return new Observable<Realtor[]>(observer => {
            this._request.get<Realtor[]>(`${this._app.apiUrl()}/${this._app.namespace()}/site/realtors`).subscribe(
                response => {
                    response.map(realtor => {
                        if (!realtor.profile_image_url) {
                            realtor.profile_image_url = `${this._app.layoutBucketPath()}/image/realtor-image.jpg`;
                        }
                    });
                    observer.next(response);
                },
                error => observer.error('Erro: ' + error),
                () => observer.complete()
            );
        });
    }

    getRealtor(realtorId: string): Observable<Realtor>  {
        return new Observable<Realtor>(observer => {
            this._request.get<Realtor>(`${this._app.apiUrl()}/${this._app.namespace()}/site/realtors/${realtorId}`).subscribe(
                response => {
                    if (!response.profile_image_url) {
                        response.profile_image_url = `${this._app.layoutBucketPath()}/image/realtor-image.jpg`;
                    }
                    observer.next(response);
                },
                error => observer.error('Erro: ' + error),
                () => observer.complete()
            );
        });
    }

}
