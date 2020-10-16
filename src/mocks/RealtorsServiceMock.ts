import { Observable } from 'rxjs/Observable';
import { Realtor } from '../interfaces/realtor';

export class RealtorsServiceMock {

    public realtor: Realtor = <Realtor>{
        db_id: 123,
        email: 'realtor@realtor.com',
        name: 'Realtor',
        profile_image_url: '',
        tellphone: '11 98127-2270'
    };

    getRealtors(): Observable<Realtor[]>  {
        return new Observable<Realtor[]>(observer => {
            observer.next([this.realtor]);
            observer.complete();
        });
    }

}
