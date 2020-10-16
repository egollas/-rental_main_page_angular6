import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { AppService } from './app.service';
import { RequestService } from './request.service';
import { SiteContact } from '../interfaces/contact';
import { IPropertyAdvert } from '../interfaces/propertyadvert';
import { FileUploader } from 'ng2-file-upload';

@Injectable()
export class FormService {

    constructor(
        private _app: AppService,
        private _request: RequestService,
    ) { }

    public contact(contact: SiteContact): Observable<boolean> {
        this.changeLoading('block');
        const formData: FormData = new FormData();
        for (const contactKey in contact) {
            if (contact[contactKey]) {
                if (contactKey === 'profile') {
                    for (const contactProfileKey in contact.profile) {
                        if (contact.profile[contactProfileKey]) {
                            formData.append(contactProfileKey, contact.profile[contactProfileKey]);
                        }
                    }
                } else {
                    formData.append(contactKey, contact[contactKey]);
                }
            }
        }
        return new Observable<boolean>(observer => {
            this._request.postForm(`${this._app.apiUrl()}/${this._app.namespace()}/site/form-contact`, formData).subscribe(
                () => observer.next(true),
                error => {
                    this.changeLoading();
                    observer.error(error);
                    observer.complete();
                },
                () => {
                    this.changeLoading();
                    observer.complete();
                }
            );
        });
    }

    private changeLoading(displayStyle: string = 'none') {
        document.getElementById('loading').style.display = displayStyle;
    }

    propertyAdvert(propertyAdvert: IPropertyAdvert, propertyPhotos: FileUploader): Observable<boolean> {
        this.changeLoading('block');
        const formData: FormData = new FormData();
        for (const propertyAdvertKey in propertyAdvert) {
            if (propertyAdvert[propertyAdvertKey]) {
                formData.append(propertyAdvertKey, propertyAdvert[propertyAdvertKey]);
            }
        }
        return new Observable<boolean>(observer => {
            this._request.postForm<{db_key: string, code: string}>(
                `${this._app.apiUrl()}/${this._app.namespace()}/site/form-property`, formData).subscribe(
                response => {
                    // tslint:disable-next-line:max-line-length
                    propertyPhotos.setOptions({ url: `${this._app.apiUrl()}/${this._app.namespace()}/site/form-property/${response.code}/photos` });
                    propertyPhotos.onBeforeUploadItem = (item) => {
                        item.withCredentials = false;
                    };
                    if (propertyPhotos.queue.length > 0) {
                        propertyPhotos.uploadAll();
                        propertyPhotos.onCompleteAll = () => {
                            this.changeLoading();
                            observer.next(true);
                            observer.complete();
                        };
                    } else {
                        this.changeLoading();
                        observer.next(true);
                        observer.complete();
                    }
                },
                error => {
                    this.changeLoading();
                    observer.error(error);
                    observer.complete();
                }
            );
        });
    }

    sendCustomForm(customFormData: any, customFormFiles?: FileUploader): Observable<string> {
        const formData: FormData = new FormData();
        for (const customer in customFormData) {
            if (customFormData[customer]) {
                formData.append(customer, customFormData[customer]);
            }
        }
        if (customFormFiles) {
            // tslint:disable-next-line:forin
            for (const fileItem in customFormFiles.queue) {
                formData.append('attachments', customFormFiles.queue[fileItem]._file, customFormFiles.queue[fileItem]._file.name);
            }
        }
        return new Observable<string>(observer => {
            this._request.postForm(`${this._app.apiUrl()}/${this._app.namespace()}/site/custom-form`, formData).subscribe(
                response => observer.next('form_sent'),
                error => observer.error(error),
                () => observer.complete()
            );
        });
    }

}
