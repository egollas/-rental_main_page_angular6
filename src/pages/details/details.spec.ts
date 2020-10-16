import { CurrencyPipe } from '@angular/common';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent } from '../../mocks/componentsMock';
import { PropertyServiceMock } from '../../mocks/propertyServiceMock';
import { FieldGroupsPipe } from '../../pipes/fields.pipe';
import { SanitizedHtmlPipeModule } from '../../pipes/sanitized-html.pipe.module';
import { PropertyService } from '../../services/property.service';
import { DetailsPage } from './details';

describe('DetailsPage', () => {
    let component: DetailsPage;
    let fixture: ComponentFixture<DetailsPage>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                DetailsPage,
                FieldGroupsPipe,
                MockComponent(
                    {
                        selector: 'property-contact-form',
                        inputs: ['vacationRental', 'propertyCode']
                    }
                ),
                MockComponent(
                    {
                        selector: 'properties-related',
                        inputs: ['propertiesRelated']
                    }
                ),
                MockComponent(
                    {
                        selector: 'property-listing-broker',
                        inputs: ['listingBroker']
                    }
                ),
                MockComponent(
                    {
                        selector: 'imobzi-breadcrumb',
                        inputs: ['pageTitle']
                    }
                ),
                MockComponent(
                    {
                        selector: 'property-galery',
                        inputs: ['multimidias', 'photos']
                    }
                ),
                MockComponent(
                    {
                        selector: 'property-calendar',
                        inputs: ['propertyCalendar']
                    }
                ),
                MockComponent(
                    {
                        selector: 'imobzi-property-location',
                        inputs: ['lgn', 'lat']
                    }
                )
            ],
            imports: [RouterTestingModule, SanitizedHtmlPipeModule],
            providers: [
                CurrencyPipe,
                { provide: PropertyService, useClass: PropertyServiceMock },

            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DetailsPage);
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

    it('defaultMetaTags', () => {
        component.getPropertyByCode('');
        // meta tags que o usuário definiu.
        expect(component.property.site_meta_description).toBe('Casa para alugar');
        expect(component.property.site_title).toBe('Meu titulo padrão');

        component.property.site_title = '';
        component.getPropertyByUrlPath('');
        // meta tags padrões para quando não vier o titulo preenchido.
        expect(component.property.site_title).toBe('Casa Apartamento em Eliana');

        component.property.site_meta_description = '';
        component.getPropertyByUrlPath('');
        // meta tags padrões para quando não vier a descrição preenchido.
        expect(component.property.site_meta_description).toBe(
            'Casa apartamento com 2 suítes, 2 dormitórios, 1 vaga, 3 banheiros em Eliana - São Paulo/SP para venda por R$ 200,000.00');
        component.property.tags = ['rent'];
        component.property.site_meta_description = '';
        component.getPropertyByUrlPath('');
        expect(component.property.site_meta_description).toBe(
            'Casa apartamento com 2 suítes, 2 dormitórios, 1 vaga, 3 banheiros em Eliana - São Paulo/SP para aluguel por R$ 1,500.00');
        component.property.tags = ['rent', 'sale', 'vacation_rental'];
        component.property.site_meta_description = '';
        component.getPropertyByUrlPath('');
        expect(component.property.site_meta_description).toBe(
            'Casa apartamento com 2 suítes, 2 dormitórios, 1 vaga, 3 banheiros em Eliana -',
            'São Paulo/SP para aluguel por R$ 1,500.00 e venda por R$ 200,000.00 e temporada por R$ 1,500.00');
    });
});
