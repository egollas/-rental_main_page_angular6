import { Observable } from 'rxjs/Observable';
import { IIntegration } from '../interfaces/integration';

export class IntegrationServiceMock {

    public googleMaps: IIntegration = <IIntegration>{
        db_id: 123,
        name: 'google_maps',
        active: true,
        api_key: '123_key',
        google_maps: {
            'location_type': 'APROXIMATED',
            'user_email': 'teste@imobzi.com'
        }
    };

    public googleAnalytics: IIntegration = <IIntegration>{
        db_id: 456,
        name: 'google_analytics',
        active: true,
        api_key: '',
        google_analytics: {
            'view_id': '123456',
            'view_url': 'imobzi.com',
            'tracking_id': 'UI-123456-1'
        }
    };

    public getIntegrationByName(integrationName: string): Observable<IIntegration> {
        return new Observable<IIntegration>(observer => {
            switch (integrationName) {
                case 'google_maps':
                    observer.next(this.googleMaps);
                    break;
                case 'google_analytics':
                    observer.next(this.googleAnalytics);
                    break;
            }
            observer.complete();
        });
    }

}
