import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent } from '../../mocks/componentsMock';
import { ParametsServiceMock } from '../../mocks/parametsServiceMock';
import { AppService } from '../../services/app.service';
import { ParametersService } from '../../services/parameters.service';
import { FooterComponent } from './footer';


describe('FooterComponent', () => {
    let component: FooterComponent;
    let fixture: ComponentFixture<FooterComponent>;


    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                FooterComponent,
                MockComponent(
                    {
                        selector: 'lazy-loading-image'
                    }
                )
            ],
            imports: [ RouterTestingModule ],
            providers: [
                {provide: ParametersService, useClass: ParametsServiceMock},
                AppService
             ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FooterComponent);
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
