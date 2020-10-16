import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
// components
import { PropertyHighlightFooterComponent } from './highlight-footer';
import { FieldGroupsPipe } from '../../../pipes/fields.pipe';

describe('PropertyHighlightFooterComponent', () => {
    let component: PropertyHighlightFooterComponent;
    let fixture: ComponentFixture<PropertyHighlightFooterComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                PropertyHighlightFooterComponent,
                FieldGroupsPipe
            ],
            imports: [RouterTestingModule],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PropertyHighlightFooterComponent);
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
