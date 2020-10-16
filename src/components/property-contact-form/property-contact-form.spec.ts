import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { FormService } from '../../services/form.service';
import { PropertyContactFormComponent } from './property-contact-form';


describe('PropertyContactFormComponent', () => {
    let component: PropertyContactFormComponent;
    let fixture: ComponentFixture<PropertyContactFormComponent>;


    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ PropertyContactFormComponent ],
            imports: [
                RouterTestingModule,
                FormsModule
            ],
            providers: [
                {
                    provide: FormService,
                    useValue: {}
                }
            ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PropertyContactFormComponent);
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
