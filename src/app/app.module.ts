import { registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import localePt from '@angular/common/locales/pt';
import { CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { FileUploadModule } from 'ng2-file-upload';
import { NgxMaskModule } from 'ngx-mask';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { BreadcrumbComponent } from '../components/breadcrumb/breadcrumb';
import { FooterComponent } from '../components/footer/footer';
import { RedesSociaisComponent } from '../components/footer/redes-sociais/redes-sociais';
import { HeaderComponent } from '../components/header/header';
import { MenuComponent } from '../components/header/header-menu/header-menu';
import { HeaderSearchComponent } from '../components/header/header-search/header-search';
import { HighlightGalleryComponent } from '../components/highlight-gallery/highlight-gallery';
import { LazyLoadingImage } from '../components/lazy-loading-image/lazy-loading-image';
import { MapComponent } from '../components/map/map';
import { NewsletterComponent } from '../components/newsletter/newsletter';
import { PropertyContactFormComponent } from '../components/property-contact-form/property-contact-form';
import { PropertyListingBrokerComponent } from '../components/property-listing-broker/property-listing-broker';
import { WhatsappButtonComponent } from '../components/whatsapp-button/whatsapp-button';
import { PageNotFound } from '../pages/404/404';
import { AdvertisePage } from '../pages/advertise-property/advertise-property';
import { ContactPage } from '../pages/contact/contact';
import { ContactLocationComponent } from '../pages/contact/contact-map/contact-map';
import { ContentPage } from '../pages/content/content';
import { AddThisComponent } from '../pages/details/add-this/add-this';
import { DetailsPage } from '../pages/details/details';
import { MultimidiaComponent } from '../pages/details/multimidia/multimidia';
import { PropertiesRelatedComponent } from '../pages/details/properties-related/properties-related';
import { PropertyCalendarComponent } from '../pages/details/property-calendar/property-calendar';
import { PropertyLocationComponent } from '../pages/details/property-location/property-location';
import { PropertyNotFound } from '../pages/details/property-not-found/property-not-found';
import { PropertyHighlightFooterComponent } from '../pages/home/highlight-footer/highlight-footer';
import { PropertyHighlightsComponent } from '../pages/home/highlight/highlight';
import { HomePage } from '../pages/home/home';
import { RealtorsComponent } from '../pages/home/realtors/realtors';
import { TypeSpotlightComponent } from '../pages/home/typespotlight/typespotlight';
import { JoinInUsForm } from '../pages/join-in-us/join-in-us';
import { RequestPage } from '../pages/request-property/request-property';
import { FiltersComponent } from '../pages/search/filters/filters';
import { PropertyListComponent } from '../pages/search/property-list/property-list';
import { SearchRealtorComponent } from '../pages/search/realtor/realtor';
import { SearchPage } from '../pages/search/search';
import { SuspendedComponent } from '../pages/suspended/suspended';
import { FieldGroupsPipe } from '../pipes/fields.pipe';
import { SanitizedHtmlPipeModule } from '../pipes/sanitized-html.pipe.module';
import { SearchAreaPipe } from '../pipes/search.pipe';
import { AppService } from '../services/app.service';
import { ContentService } from '../services/content.service';
import { FormService } from '../services/form.service';
import { IntegrationService } from '../services/integrations.service';
import { ParametersService } from '../services/parameters.service';
import { PropertyService } from '../services/property.service';
import { RealtorsService } from '../services/realtor.service';
import { RequestService } from '../services/request.service';
import { AppComponent } from './app.component';

registerLocaleData(localePt, 'pt-BR');

const appRoutes: Routes = [
    // home
    { path: 'home', redirectTo: ''},
    { path: '', component: HomePage },

    // pagedetails
    { path: 'imovel/codigo/:code', component: DetailsPage },
    { path: 'imovel/:urlPath', component: DetailsPage },
    { path: 'property/:urlPath', component: DetailsPage },

    // pageconteudo
    { path: 'conteudo/:id', component: ContentPage },
    { path: 'site-preview/:id', component: ContentPage},


    // Empresa
    { path: 'quem-somos', component: ContentPage },
    { path: 'nossos-servicos', component: ContentPage },
    { path: 'trabalhe-conosco', component: JoinInUsForm },
    { path: 'parceiros', component: ContentPage },

    // imoveis
    { path: 'buscar', component: SearchPage },

    // Servicos
    { path: 'financiamento', component: ContentPage },
    { path: 'documentacao', component: ContentPage },
    { path: 'cadastre-seu-imovel', component: AdvertisePage },
    { path: 'peca-seu-imovel', component: RequestPage },

    // contato
    { path: 'contato', component: ContactPage },

    // searchCorretor
    { path: 'corretor/:nickname', component: SearchPage },

    // propertynotfound
    { path: 'imovel-nao-encontrado', component: PropertyNotFound},

    // pagenotfound
    { path: 'pagina-nao-encontrada', component: PageNotFound},
    { path: 'suspended', component: SuspendedComponent},
    { path: '**', redirectTo: 'pagina-nao-encontrada'},
];

@NgModule({
    declarations: [
        AppComponent,
        LazyLoadingImage,
        HomePage,
        DetailsPage,
        ContactPage,
        RequestPage,
        AdvertisePage,
        ContentPage,
        SearchPage,
        SearchRealtorComponent,
        PageNotFound,
        PropertyNotFound,
        HeaderComponent,
        MenuComponent,
        HeaderSearchComponent,
        FooterComponent,
        BreadcrumbComponent,
        PropertyContactFormComponent,
        PropertyHighlightsComponent,
        TypeSpotlightComponent,
        RealtorsComponent,
        MapComponent,
        MultimidiaComponent,
        PropertiesRelatedComponent,
        PropertyCalendarComponent,
        PropertyLocationComponent,
        PropertyListingBrokerComponent,
        NewsletterComponent,
        ContactLocationComponent,
        FiltersComponent,
        PropertyListComponent,
        FieldGroupsPipe,
        SearchAreaPipe,
        PropertyHighlightFooterComponent,
        HighlightGalleryComponent,
        AddThisComponent,
        JoinInUsForm,
        SuspendedComponent,
        WhatsappButtonComponent,
        RedesSociaisComponent
    ],
    imports: [
        BrowserModule.withServerTransition({appId: 'imobzisite-layout12'}),
        SwiperModule,
        HttpModule,
        HttpClientModule,
        FormsModule,
        FileUploadModule,
        SanitizedHtmlPipeModule,
        NgxMaskModule.forRoot(),
        RouterModule.forRoot(appRoutes)
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ],
    providers: [
        AppService,
        ContentService,
        {provide: LOCALE_ID, useValue: 'pt-BR'},
        FormService,
        ParametersService,
        PropertyService,
        RequestService,
        RealtorsService,
        IntegrationService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
