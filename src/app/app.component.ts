import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID, AfterViewInit, OnChanges } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivationEnd, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { IGoogleAnalytics, IIntegration } from '../interfaces/integration';
import { Parameters } from '../interfaces/parameters';
import { AppService } from '../services/app.service';
import { IntegrationService } from '../services/integrations.service';
import { ParametersService } from '../services/parameters.service';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    private defaultTitle: string;
    private defaultDescription: string;
    public parameters: Parameters;
    public googleMaps: IIntegration = <IIntegration>{};
    public googleAnalytics: IGoogleAnalytics = <IGoogleAnalytics>{};
    public calledFromHome: boolean;

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private _app: AppService,
        private _integration: IntegrationService,
        private _parameters: ParametersService,
        private title: Title,
        private meta: Meta,
        private router: Router,
    ) { }


    getParameters() {
        this._parameters.getParameters().subscribe(parameters => {
            this.parameters = parameters;
            this.setMetaTags();
        },
            () => {
                this.title.setTitle('Imobiliária');
            });
    }

    setMetaTags() {
        this.setMetaTitle();
        if (this.parameters.site_meta_description) {
            this.meta.updateTag({ name: 'description', content: this.parameters.site_meta_description });
            this.meta.updateTag({ property: 'og:description', content: this.parameters.site_meta_description });
        } else {
            this.defaultDescription = `${this.parameters.company_name} - Imobiliária em ${this.parameters.city}`;
            this.defaultDescription += ' com imóveis para venda, locação e lançamentos';
            this.meta.updateTag({ name: 'description', content: this.defaultDescription });
            this.meta.updateTag({ property: 'og:description', content: this.defaultDescription });
            this.meta.updateTag({ property: 'og:url', content: 'https://' + window.location.host });
            this.meta.updateTag({ property: 'og:type', content: 'website' });
            this.meta.updateTag({ property: 'fb:app_id', content: '559276504090135' });
        }
        this.meta.updateTag({ property: 'og:image', content: this._app.clientBucketPath() + '/logo.png' });
    }

    ngOnInit() {
        this.getParameters();
        // this.getGoogleAnalytics();
        // this.getGoogleMaps();
        this.setFavicon();
        this.router.events.subscribe((evt) => {

            if (this._app.layoutType().layout === 'fixed') {
                this.isCalledFromHome(evt);
            }

            if (evt instanceof NavigationStart && this.parameters) {
                this.setMetaTags();
            }
            if (!(evt instanceof NavigationEnd)) {
            } else if (isPlatformBrowser(this.platformId)) { window.scrollTo(0, 0); }
        });
    }

    isCalledFromHome(evt) {
        if (evt instanceof ActivationEnd) {
            (evt.snapshot.routeConfig.path === '')
                ? this.calledFromHome = true
                : this.calledFromHome = false;
        }
    }


    getGoogleMaps() {
        const url = 'https://maps.googleapis.com/maps/api/js';
        this._integration.getIntegrationByName('google_maps').subscribe((googleMaps: IIntegration) => {
            if (googleMaps) {
                this.googleMaps = googleMaps;
                this.setScriptUrl(`${url}?key=${this.googleMaps.api_key}`, 'googleMapsScript');
            }
        });
    }

    getGoogleAnalytics() {
        this._integration.getIntegrationByName('google_analytics').subscribe((integration: IIntegration) => {
            if (integration && integration.google_analytics && integration.google_analytics.tracking_id) {
                this.googleAnalytics = integration.google_analytics;
                this.setGoogleAnalytics();
            }
        });
    }

    private setScriptUrl(scriptUrl: string, scriptId: string) {
        const scriptNode = document.createElement('script');
        scriptNode.src = `${scriptUrl}`;
        scriptNode.type = 'text/javascript';
        scriptNode.async = true;
        scriptNode.charset = 'utf-8';
        scriptNode.id = scriptId;
        document.getElementsByTagName('head')[0].appendChild(scriptNode);
    }

    private setGoogleAnalytics() {
        this.setScriptUrl(`https://www.googletagmanager.com/gtag/js?id=${this.googleAnalytics.tracking_id}`, 'googleAnalyticsSxript');
        const head = document.getElementsByTagName('head')[0];
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.innerHTML = `
            window.dataLayer = window.dataLayer || [];
            function gtag() {
                dataLayer.push(arguments);
            }
            gtag('js', new Date());
            gtag('config', '${this.googleAnalytics.tracking_id}');
        `;
        head.appendChild(script);
    }

    private setMetaTitle() {
        if (this.parameters.site_title) {
            this.title.setTitle(this.parameters.site_title);
            this.meta.updateTag({ property: 'og:title', content: this.parameters.site_title });
        } else {
            if (this.parameters.company_type === 'legal_entity') {
                this.defaultTitle = 'Imobiliária ' + this.parameters.company_name;
            } else {
                this.defaultTitle = this.parameters.company_name + ' corretor de imóveis';
            }
            if (this.parameters.city) {
                this.defaultTitle += ` em ${this.parameters.city}`;
            }
            this.title.setTitle(this.defaultTitle);
            this.meta.updateTag({ property: 'og:title', content: this.defaultTitle });
        }
    }

    private setFavicon() {
        const favicon = document.createElement('link');
        favicon.href = `${this._app.clientBucketPath()}/favicon.ico`;
        favicon.type = 'image/x-icon';
        favicon.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(favicon);
    }
}
