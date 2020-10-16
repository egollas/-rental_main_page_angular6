import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { PropertyServiceMock } from '../../../mocks/propertyServiceMock';
import { FieldGroupsPipe } from '../../../pipes/fields.pipe';
import { PropertyService } from '../../../services/property.service';
import { HeaderSearchComponent } from './header-search';

describe('HeaderSearchComponent', () => {
    let component: HeaderSearchComponent;
    let fixture: ComponentFixture<HeaderSearchComponent>;


    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                HeaderSearchComponent,
                FieldGroupsPipe
            ],
            imports: [
                RouterTestingModule,
                FormsModule
            ],
            providers: [
                { provide: PropertyService, useClass: PropertyServiceMock },
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(HeaderSearchComponent);
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

    it('Select first availability and type', () => {
        expect(component.availabilitySelected).toEqual('buy');
    });

});
