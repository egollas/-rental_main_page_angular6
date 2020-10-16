import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { Realtor } from '../../interfaces/realtor';
import { MockComponent } from '../../mocks/componentsMock';
import { PropertyListingBrokerComponent } from './property-listing-broker';
import { AppService } from '../../services/app.service';

describe('PropertyListingBrokerComponent', () => {
    let component: PropertyListingBrokerComponent;
    let fixture: ComponentFixture<PropertyListingBrokerComponent>;


    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                PropertyListingBrokerComponent,
                MockComponent(
                    {
                        selector: 'lazy-loading-image'
                    }
                )
            ],
            imports: [ RouterTestingModule ],
            providers: [
                AppService,
            ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PropertyListingBrokerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterEach(() => {
        fixture.destroy();
        component = null;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('Show listing broker info', () => {
        component.listingBroker = <Realtor>{};
        component.listingBroker.name = 'Realtor test';
        component.listingBroker.email = 'realtor@realtor.com';
        fixture.autoDetectChanges();
        expect(document.getElementsByClassName('tm-agent-info__title')[0].textContent).toEqual('Realtor test');
    });

});
