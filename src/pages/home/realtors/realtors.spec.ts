import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent } from '../../../mocks/componentsMock';
import { RealtorsServiceMock } from '../../../mocks/RealtorsServiceMock';
import { AppService } from '../../../services/app.service';
import { RealtorsService } from '../../../services/realtor.service';
import { RealtorsComponent } from './realtors';

describe('RealtorsComponent', () => {
    let component: RealtorsComponent;
    let fixture: ComponentFixture<RealtorsComponent>;


    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                RealtorsComponent,
                MockComponent(
                    {
                        selector: 'lazy-loading-image'
                    }
                )
            ],
            imports: [ RouterTestingModule ],
            providers: [
                AppService,
                {provide: RealtorsService, useClass: RealtorsServiceMock}
             ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RealtorsComponent);
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
