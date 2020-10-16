import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent } from '../../../mocks/componentsMock';
import { FieldGroupsPipe } from '../../../pipes/fields.pipe';
import { PropertyHighlightsComponent } from './highlight';

describe('PropertyHighlightsComponent', () => {
    let component: PropertyHighlightsComponent;
    let fixture: ComponentFixture<PropertyHighlightsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                PropertyHighlightsComponent,
                FieldGroupsPipe,
                MockComponent(
                    {
                        selector: 'lazy-loading-image'
                    }
                )
            ],
            imports: [RouterTestingModule],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PropertyHighlightsComponent);
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
