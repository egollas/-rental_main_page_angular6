import { Observable } from 'rxjs/Observable';
import { Parameters } from '../interfaces/parameters';

export class ParametsServiceMock {

    public parameters: Parameters = <Parameters>{
        logotype_image_url: '',
        company_name: 'Quickfast',
        address: 'Avenida mario lopes leão',
        address_complement: '',
        neighborhood: 'Santo Amaro',
        city: 'São Paulo'
    };

    public getParameters(): Observable<Parameters> {
        return new Observable<Parameters>(observer => {
            observer.next(this.parameters);
            observer.complete();
        });
    }

}
