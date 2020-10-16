import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class RequestService {

    constructor(
        private http: Http,
        private router: Router
    ) { }

    private options(): RequestOptions {
        return new RequestOptions({ headers: new Headers({ 'Content-Type': 'application/json' })});
    }

    get<T>(url: string, params: string = ''): Observable<T> {
        return new Observable<T>(observer => {
            this.http.get(url + '?' + params).subscribe(
                response => {
                    observer.next(response.json());
                    observer.complete();
                },
                error => {
                    if (error && error.status === 402) {
                        this.router.navigate(['suspended']);
                    }
                    observer.error(error);
                    observer.complete();
                },
                () => observer.complete()
            );
        });
    }

    post<T>(url: string, params: string = ''): Observable<T> {
        return new Observable<T>(observer => {
                this.http.post(url, params, this.options()).subscribe(
            response => observer.next(response.json()),
            error => {
                observer.error(error);
                observer.complete();
            },
            () => observer.complete());
        });
    }

    postForm<T>(url: string, params: FormData): Observable<T> {
        return new Observable<T>(observer => {
            this.http.post(url, params).subscribe(
                response => observer.next(response.json()),
                error => {
                    observer.error(error);
                    observer.complete();
                },
                () => observer.complete()
            );
        });
    }

}
