import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { MockComponent } from '../mocks/componentsMock';
import { IntegrationServiceMock } from '../mocks/integrationServiceMock';
import { ParametsServiceMock } from '../mocks/parametsServiceMock';
import { AppService } from '../services/app.service';
import { IntegrationService } from '../services/integrations.service';
import { ParametersService } from '../services/parameters.service';
import { AppComponent } from './app.component';


class MockRouter {
    navigate = jasmine.createSpy('navigate');
    events = new Observable<Event>();
}

fdescribe('AppComponent', () => {
    let component: AppComponent;
    let fixture: ComponentFixture<AppComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
        declarations: [
            AppComponent,
            MockComponent(
                {
                    selector: 'property-contact-form',
                    inputs: ['vacationRental', 'propertyCode']
                }
            ),
        ],
        providers: [
            AppService,
            {
                provide: Router,
                useClass: MockRouter
            },
            {
                provide: ParametersService,
                useClass: ParametsServiceMock
            },
            {
                provide: IntegrationService,
                useClass: IntegrationServiceMock
            }
        ],
        schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AppComponent);
        component = fixture.componentInstance;
    });

    afterEach(() => {
        fixture.destroy();
        component = null;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('add googleMaps script', async(() => {
        fixture.detectChanges();
        const googleMapsScript = document.getElementsByTagName('head')[0].getElementsByTagName('script')[2];
        expect(googleMapsScript['src']).toBe('https://maps.googleapis.com/maps/api/js?key=123_key');
    }));

    it('add googleAnalytics script', async(() => {
        fixture.detectChanges();
        const googleAnalyticsScript = document.getElementsByTagName('head')[0].getElementsByTagName('script')[0];
        expect(googleAnalyticsScript['src']).toBe('https://www.googletagmanager.com/gtag/js?id=UI-123456-1');
    }));
});
