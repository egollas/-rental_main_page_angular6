import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { SiteContact } from '../../interfaces/contact';
import { IIntegration } from '../../interfaces/integration';
import { Parameters } from '../../interfaces/parameters';
import { FormService } from '../../services/form.service';
import { IntegrationService } from '../../services/integrations.service';
import { ParametersService } from '../../services/parameters.service';

declare var $: any;

@Component({
    selector: 'imobzi-contact',
    templateUrl: './contact.html',
    styleUrls: ['./contact.scss']
})
export class ContactPage implements OnInit, AfterViewInit {

    public displaySuccess = false;
    public displayFailure = false;
    public contact: SiteContact = <SiteContact>{};
    public submitForm: boolean;
    public parameters: Parameters;
    public latLng: boolean;

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        public _parameters: ParametersService,
        private title: Title,
        private _formService: FormService,
        private _integration: IntegrationService,
    ) { }

    ngOnInit() {
        this.getParametersForMap();
        this.submitForm = false;
        if (isPlatformBrowser(this.platformId)) {
            document.getElementsByTagName('body')[0].className = '';
            document.getElementsByTagName('body')[0].classList.add(
                'page',
                'position-one-left-sidebar',
                'sidebar-1-4',
                'tm_pb_builder'
            );
        }
    }

    ngAfterViewInit() {
        this.title.setTitle('Contato | ' + this.title.getTitle());
    }

    getParametersForMap() {
        this._parameters.getParameters().subscribe(parameters => {
            this.parameters = parameters;
            (this.parameters.address && this.parameters.latitude && this.parameters.longitude)
                ? this.latLng = true
                : this.latLng = false;
        });
        this._integration.getIntegrationByName('google_maps').subscribe((googleMaps: IIntegration) => {
            if (googleMaps) {
            }
        });
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
            ($('.message-error').offset() !== undefined)
                ? $('html,body').animate({scrollTop: $('.message-error').offset().top}, 'slow')
                : $('html,body').animate({scrollTop: $('#primary').offset().top}, 'slow');
        }
    }

}
