import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ContactProfile, SiteContact } from '../../interfaces/contact';
import { AdvertisePropertyType } from '../../interfaces/property';
import { FormService } from '../../services/form.service';
import { PropertyService } from '../../services/property.service';
import { translateFinality } from '../../utils/utils';

declare var $: any;

@Component({
    selector: 'imobzi-request-property',
    templateUrl: './request-property.html',
    styleUrls: ['./request-property.scss']
})
export class RequestPage implements OnInit {

    public contact: SiteContact;
    public displaySuccess = false;
    public displayFailure = false;
    public propertyTypes: AdvertisePropertyType[];
    public profileInterests: Array<string> = [];
    submitForm: boolean;

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private _formService: FormService,
        private _properties: PropertyService
    ) { }

    ngOnInit() {
        this.submitForm = false;
        this.contact = <SiteContact>{};
        this.contact.profile = <ContactProfile>{};
        this.contact.profile.interest = 'Compra';
        this.contact.profile.property_type = 'Não especificado';
        this.profileInterests = [
            'Compra',
            'Locação',
            'Compra / Locação',
            'Temporada'
        ];
        if (isPlatformBrowser(this.platformId)) {
            document.getElementsByTagName('body')[0].className = '';
            document.getElementsByTagName('body')[0].classList.add(
                'page',
                'position-one-left-sidebar',
                'sidebar-1-4',
                'tm_pb_builder'
            );
        }
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
        });
    }

    public translateFinality(finality: string) {
        translateFinality(finality);
    }

    public submit(form: NgForm): void {
        if (form.valid) {
            this._formService.contact(this.contact).subscribe(
                () => {
                    form.resetForm();
                    this.displaySuccess = true;
                    this.displayFailure = false;
                    this.submitForm = true;
                },
                () => this.displayFailure = true
            );
        } else {
            this.displaySuccess = false;
            this.displaySuccess = false;
            ($('.message-error').offset() !== undefined)
                ? $('html,body').animate({scrollTop: $('.message-error').offset().top}, 'slow')
                : $('html,body').animate({scrollTop: $('#primary').offset().top}, 'slow');
        }
    }
}
