import { Observable } from 'rxjs/Observable';
import { Content } from '../interfaces/content';

const content: Content = {
    title: 'Meu content',
    meta_description: 'Meu content',
    url: 'meu-content',
    page_body: '<p></p>',
    db_key: '423rvr4dx64d5c6c'
};

export class ContentServiceMock {

    public getContent(contentId: number): Observable<Content> {
        return new Observable<Content>(observer => {
            observer.next(content);
            observer.complete();
        });
    }
}
