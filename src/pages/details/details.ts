import { CurrencyPipe, isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { IIntegration } from '../../interfaces/integration';
import { Property } from '../../interfaces/property';
import { IntegrationService } from '../../services/integrations.service';
import { PropertyService } from '../../services/property.service';
import { removeHtmlTags, setPhotoUrlResize } from '../../utils/utils';

declare var $: any;

@Component({
    selector: 'imobzi-details',
    templateUrl: './details.html',
    providers: [CurrencyPipe],
    styleUrls: ['./details.scss']
})
export class DetailsPage implements OnInit, AfterViewInit {

    public property: Property;
    public propertiesRelated: Array<Property>;
    public titleDefault: string;
    public map: boolean;

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private _property: PropertyService,
        private activeRoute: ActivatedRoute,
        private route: Router,
        private title: Title,
        private meta: Meta,
        private _integration: IntegrationService,
        private currencyPipe: CurrencyPipe
    ) { }

    ngOnInit() {
        this.setPropertyLocation();
        this.activeRoute.params.subscribe(route => {
            this.property = undefined;
            this.changeLoading('block');
            if (route['code']) {
                this.getPropertyByCode(route['code']);
            } else if (route['urlPath']) {
                this.getPropertyByUrlPath(location.pathname);
            } else {
                this.route.navigate(['imovel-nao-encontrado']);
            }
            if (isPlatformBrowser(this.platformId)) {
                document.getElementsByTagName('body')[0].className = '';
                document.getElementsByTagName('body')[0].classList.add(
                    'tm-property--single',
                    'single',
                    'single-tm-property',
                    'position-one-left-sidebar'
                );
            }
        });
    }

    ngAfterViewInit() {
        $('html,body').animate({ scrollTop: 0 }, 'slow');
        if (document.getElementsByClassName('imobzi-details')) {
            $('html,body').animate({ scrollTop: $('imobzi-details').offset().top }, 'slow');
        }
    }

    setPropertyLocation() {
        this._integration.getIntegrationByName('google_maps').subscribe((googleMaps: IIntegration) => {
            (googleMaps)
                ? this.map = true
                : this.map = false;
        });
    }
    getPropertyByCode(propertyCode: string) {
        this._property.getProperty(propertyCode).subscribe(
            property => {
                this.property = property;
                this.translateFinality();
                if (!this.property.site_title) {
                    this.generatePropertyTitle();
                }
                if (!this.property.site_meta_description) {
                    this.generatePropertyMetaDescription();
                }
                this.setMetaTags();
                this._property.updateSiteCount(this.property.code);
                this.getPropertiesRelated();
                this.changeLoading();
            },
            () => {
                this.changeLoading();
                this.route.navigate(['imovel-nao-encontrado']);
            }
        );
    }

    getPropertyByUrlPath(propertyUrl: string) {
        this._property.getPropertyByUrl(propertyUrl).subscribe(
            property => {
                this.property = property;
                this.translateFinality();
                if (!this.property.site_title) {
                    this.generatePropertyTitle();
                }
                if (!this.property.site_meta_description) {
                    this.generatePropertyMetaDescription();
                }
                this.setMetaTags();
                this._property.updateSiteCount(this.property.code);
                this.getPropertiesRelated();
                this.changeLoading();
            },
            () => {
                this.changeLoading();
                this.route.navigate(['imovel-nao-encontrado']);
            }
        );
    }

    private translateFinality() {
        switch (this.property.finality) {
            case 'residential':
                this.property.finality = 'Residencial';
                break;
            case 'commercial':
                this.property.finality = 'Comercial';
                break;
            case 'rural':
            case 'Rural':
                this.property.finality = 'Rural';
        }
    }

    private getPropertiesRelated() {
        this._property.getPropertiesRelated(this.property.code).subscribe(
            properties => {
                this.propertiesRelated = properties;
                this.propertiesRelated.forEach(property => {
                    if (property.cover_photo && property.cover_photo.url) {
                        property.cover_photo.url = setPhotoUrlResize(property.cover_photo.url);
                    }
                    if (property.site_description) {
                        property.site_description = removeHtmlTags(property.site_description);
                    }
                });
            },
            () => this.propertiesRelated = undefined
        );
    }

    private setMetaTags() {
        if (this.titleDefault) {
            this.title.setTitle(`${this.titleDefault} | ${this.title.getTitle()}`);
            this.meta.updateTag({ property: 'og:title', content: `${this.titleDefault} | ${this.title.getTitle()}` });
        } else {
            this.title.setTitle(`${this.property.site_title} | ${this.title.getTitle()}`);
            this.meta.updateTag({ property: 'og:title', content: `${this.title.getTitle()}` });
        }
        this.meta.updateTag({ name: 'description', content: this.property.site_meta_description });
        this.meta.updateTag({ name: 'url', content: window.location.host + this.property.site_url });
        this.meta.updateTag({ property: 'og:description', content: this.property.site_meta_description });
        this.meta.updateTag({ property: 'og:url', content: 'https://' + window.location.host + this.property.site_url });
        this.meta.updateTag({ property: 'og:type', content: 'website' });
        this.meta.updateTag({ property: 'fb:app_id', content: '559276504090135' });
        if (this.property.cover_photo.url) {
            this.meta.updateTag({ property: 'og:image', content: this.property.cover_photo.url });
        } else if (this.property.photos && this.property.photos.length > 0) {
            this.meta.updateTag({ property: 'og:image', content: this.property.photos[0].url });
        }
    }

    private generatePropertyMetaDescription() {
        this.property.site_meta_description = `${this.property.property_type} ${this.property.finality.toLowerCase()}`;
        const propertyTags: Array<string> = [];
        if (this.property.tags) {
            this.property.tags.forEach(tag => {
                switch (tag) {
                    case 'sale':
                        let sale = 'venda';
                        if (this.property.sale_value > 0) {
                            sale += ` por ${this.currencyPipe.transform(Number(this.property.sale_value), 'BRL', 'symbol', '1.0-0')}`;
                        }
                        propertyTags.push(sale);
                        break;

                    case 'rent':
                        let rent = 'aluguel';
                        if (this.property.rental_value > 0) {
                            rent += ` por ${this.currencyPipe.transform(this.property.rental_value, 'BRL', 'symbol', '1.0-0')}`;
                        }
                        propertyTags.push(rent);
                        break;

                    case 'vacation_rental':
                        let vacationRental = 'temporada';
                        if (this.property.rental_value > 0) {
                            vacationRental += ` por ${this.currencyPipe.transform(this.property.rental_value, 'BRL', 'symbol', '1.0-0')}`;
                        }
                        propertyTags.push(vacationRental);
                        break;
                }
            });
        }
        this.property.site_meta_description = `${this.property.property_type} ${this.property.finality.toLowerCase()}`;
        this.property.site_meta_description += `${(this.getRoomsPropertyText()) ? ' com ' + this.getRoomsPropertyText() : ''}`;
        this.property.site_meta_description += ` em ${this.property.neighborhood} - ${this.property.city}/${this.property.state}`;
        this.property.site_meta_description += ` para ${propertyTags.join(' e ')}`;
    }

    private getRoomsPropertyText(): string {
        const accommodations: Array<string> = [];

        if (this.property.suite) {
            accommodations.push(`${this.property.suite} ${(this.property.suite > 1) ? 'suítes' : 'suíte'}`);
        }
        if (this.property.bedroom) {
            accommodations.push(`${this.property.bedroom} ${(this.property.bedroom > 1) ? 'dormitórios' : 'dormitório'}`);
        }
        if (this.property.garage) {
            accommodations.push(`${this.property.garage} ${(this.property.garage > 1) ? 'vagas' : 'vaga'}`);
        }
        if (this.property.bathroom) {
            accommodations.push(`${this.property.bathroom} ${(this.property.bathroom > 1) ? 'banheiros' : 'banheiro'}`);
        }
        return accommodations.join(', ');
    }

    private generatePropertyTitle() {
        this.titleDefault = this.property.property_type + ' ' + this.property.finality.toLowerCase();
        this.property.site_title = this.property.property_type + ' ' + this.property.finality + ' em ' + this.property.neighborhood;
        if (this.property.suite) {
            this.titleDefault += ` com ${this.property.suite} ${(this.property.suite > 1) ? 'suítes' : 'suíte'}`;
        } else if (this.property.bedroom) {
            this.titleDefault += ` com ${this.property.bedroom} ${(this.property.bedroom > 1) ? 'dormitórios' : 'dormitório'}`;
        }
        this.titleDefault += ` em ${this.property.neighborhood} - ${this.property.city}/${this.property.state}`;
    }

    private changeLoading(displayStyle: string = 'none') {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.style.display = displayStyle;
        }
    }
}
