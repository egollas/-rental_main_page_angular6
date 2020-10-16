import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { FileUploader } from 'ng2-file-upload';
import { AdvertisePropertyType } from '../../interfaces/property';
import { IPropertyAdvert } from '../../interfaces/propertyadvert';
import { AppService } from '../../services/app.service';
import { FormService } from '../../services/form.service';
import { PropertyService } from '../../services/property.service';
import { translateFinality } from '../../utils/utils';

declare var $: any;

@Component({
    selector: 'imobzi-advertise-property',
    templateUrl: './advertise-property.html',
    styleUrls: ['./advertise-property.scss']
})
export class AdvertisePage implements OnInit {

    @ViewChild('form') form: NgForm;
    public propertyAdvert: IPropertyAdvert = <IPropertyAdvert>{};
    public states: Array<string>;
    public displaySuccess = false;
    public displayFailure = false;
    public zipCode: boolean;
    public submitForm: boolean;
    public propertyTypes: AdvertisePropertyType[];
    public propertyTypeSelectedIndex: number;
    public propertyAvailabilities: Array<string>;
    public step = 1;

    public uploader: FileUploader = new FileUploader({
        maxFileSize: 251658240,
        queueLimit: 10,
        method: 'POST',
        allowedFileType: ['image']
    });

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private _app: AppService,
        private title: Title,
        private _formService: FormService,
        private _properties: PropertyService,
        private _http: HttpClient
    ) { }



    ngOnInit() {
        this.submitForm = false;
        if (isPlatformBrowser(this.platformId)) {
            document.getElementsByTagName('body')[0].className = '';
            document.getElementsByTagName('body')[0].classList.add(
                'page',
                'position-one-left-sidebar',
                'sidebar-1-4', 'tm_pb_builder'
            );
        }
        this.title.setTitle('Anuncie seu imóvel - ' + this.title.getTitle());
        this.states = [
            'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
            'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
        ];

        this._properties.getPropertyTypes().subscribe((propertyTypes: AdvertisePropertyType[]) => {
            propertyTypes.forEach(type => {
                type.finality = translateFinality(type.finality);
            });

            this.propertyTypes = propertyTypes;
            this.propertyTypes.sort((propertyType1, propertyType2) => {
                if (propertyType1.finality > propertyType2.finality) {
                    return 1;
                } else {
                    return 0;
                }
            });

            if (this.propertyTypes.length === 0) {
                this.propertyTypes.push({ finality: 'Comercial', type: 'Sala' });
                this.propertyTypes.push({ finality: 'Residencial', type: 'Casa' });
                this.propertyTypes.push({ finality: 'Rural', type: 'Terreno' });
            }
        });

        this.propertyAdvert.country = 'Brasil';
        this.propertyAdvert.availability = 'Venda / Locação';
        this.propertyAvailabilities = ['Venda', 'Locação', 'Venda / Locação', 'Temporada'];
    }

    setPropertyTypeValues() {
        if (Number(this.propertyTypeSelectedIndex)) {
            this.propertyAdvert.finality = this.propertyTypes[Number(this.propertyTypeSelectedIndex)].finality;
            this.propertyAdvert.property_type = this.propertyTypes[Number(this.propertyTypeSelectedIndex)].type;
        }
    }

    public goBack(): void {
        if (this.step === 2) {
            this.step--;
            $('#passo_01').show();
            $('#passo_02').hide();
            $('#trail_01').addClass('steps-trail-current-item');
            $('#trail_02').removeClass('steps-trail-current-item');
        } else if (this.step === 3) {
            this.step--;
            $('#passo_02').show();
            $('#passo_03').hide();
            $('#trail_02').addClass('steps-trail-current-item');
            $('#trail_03').removeClass('steps-trail-current-item');
        }
    }

    getAddressByZipCode() {
        if (this.propertyAdvert.zipcode) {
            this.changeLoading('block');
            this._http.get('https://viacep.com.br/ws/' + this.propertyAdvert.zipcode + '/json').subscribe(
                address => {
                    this.changeLoading();
                    if (!address['erro']) {
                        this.propertyAdvert.address = address['logradouro'];
                        this.propertyAdvert.neighborhood = address['bairro'];
                        this.propertyAdvert.city = address['localidade'];
                        this.propertyAdvert.state = address['uf'];
                    } else {
                        this.zipCode = address['erro'];
                    }
                },
                () => this.changeLoading()
            );
        }
    }

    public openUploader(): void {
        if (isPlatformBrowser(this.platformId)) { document.getElementById('uploader').click(); }
    }

    private changeLoading(displayStyle: string = 'none') {
        document.getElementById('loading').style.display = displayStyle;
    }

    public submit(form: NgForm): void {
        const formControls = form.controls;
        switch (this.step) {
            case 1:
                if (formControls.name.valid && formControls.phone.valid && formControls.email.valid) {
                    this.step++;
                    $('#passo_01').hide();
                    $('#passo_02').show();
                    $('#backButton').show();
                    $('#trail_01').removeClass('steps-trail-current-item');
                    $('#trail_02').addClass('steps-trail-current-item');
                }
                break;
            case 2:
                if (form.valid) {
                    this.step++;
                    $('#passo_02').hide();
                    $('#passo_03').show();
                    $('#trail_02').removeClass('steps-trail-current-item');
                    $('#trail_03').addClass('steps-trail-current-item');
                }
                break;
            case 3:
                if (form.valid) {
                    this._formService.propertyAdvert(this.propertyAdvert, this.uploader).subscribe(
                        () => {
                            form.reset();
                            this.displaySuccess = true;
                            this.displayFailure = false;
                            this.submitForm = true;
                            $('#passo_03').hide();
                            $('#passo_04').show();
                            $('#backButton').hide();
                            $('#submitButton').hide();
                        },
                        error => {
                            this.displaySuccess = false;
                            this.displayFailure = true;
                        }
                    );
                }
                break;
            default:
                this.displayFailure = true;
                break;
        }
    }
}
