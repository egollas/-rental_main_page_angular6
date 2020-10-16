import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent } from '../../../mocks/componentsMock';
import { PropertyServiceMock } from '../../../mocks/propertyServiceMock';
import { AppService } from '../../../services/app.service';
import { PropertyService } from '../../../services/property.service';
import { TypeSpotlightComponent } from './typespotlight';

describe('TypeSpotlightComponent', () => {
    let component: TypeSpotlightComponent;
    let fixture: ComponentFixture<TypeSpotlightComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                TypeSpotlightComponent,
                MockComponent(
                    {
                        selector: 'lazy-loading-image'
                    }
                )
            ],
            imports: [RouterTestingModule],
            providers: [
                { provide: PropertyService, useClass: PropertyServiceMock },
                AppService
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TypeSpotlightComponent);
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
});
