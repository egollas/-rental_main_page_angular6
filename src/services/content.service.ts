import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Content } from '../interfaces/content';
import { AppService } from './app.service';
import { RequestService } from './request.service';

@Injectable()
export class ContentService {

    constructor(
        private _app: AppService,
        private _request: RequestService
    ) { }

    public getContent(contentUrl: string): Observable<Content> {
        return new Observable<Content>(observer => {
            this._request.get<Content>(
                    `${this._app.apiUrl()}/${this._app.namespace()}/site-content`, `url=${contentUrl}`).subscribe(
                content => observer.next(content),
                error => observer.error(error),
                () => observer.complete()
            );
        });
    }

    getSitePreviewData(key: string): Observable<Content> {
        return new Observable<Content>(observer => {
            this._request.get(`${this._app.apiUrl()}/site-preview/${key}`).subscribe(
                response => {
                    observer.next(<Content>{title: response['title'], page_body: response['content']});
                    observer.complete();
                },
                error => {
                    observer.error(error);
                    observer.complete();
                }
            );
        });
    }
}
