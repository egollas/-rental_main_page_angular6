import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent } from '../../mocks/componentsMock';
import { ContentServiceMock } from '../../mocks/contentServiceMock';
import { SanitizedHtmlPipeModule } from '../../pipes/sanitized-html.pipe.module';
import { ContentService } from '../../services/content.service';
import { ContentPage } from './content';

describe('ContentPage', () => {
    let component: ContentPage;
    let fixture: ComponentFixture<ContentPage>;


    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                ContentPage,
                MockComponent(
                    {
                        selector: 'imobzi-breadcrumb',
                        inputs: ['pageTitle']
                    }
                )
             ],
            imports: [ RouterTestingModule, SanitizedHtmlPipeModule ],
            providers: [
                {provide: ContentService, useClass: ContentServiceMock}
             ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ContentPage);
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
