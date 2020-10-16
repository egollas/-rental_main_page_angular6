import { CurrencyPipe } from '@angular/common';
import { Component, Input, OnChanges, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { Property } from '../../interfaces/property';
import { AppService } from '../../services/app.service';


declare var google: any;
declare var $: any;

@Component({
    selector: 'imobzi-map',
    templateUrl: './map.html',
    providers: [CurrencyPipe],
    styleUrls: ['./map.scss']
})
export class MapComponent implements OnChanges  {

    @ViewChild('locations') gmapElement: any;
    @Input() properties: Array<Property>;
    map: google.maps.Map;
    bounds: any;
    infowindow: any;

    constructor(
        private _app: AppService,
        private currencyPipe: CurrencyPipe
    ) { }

    ngOnChanges(change: any) {
        if (document.getElementById('googleMapsScript')) {
            this.bounds = new google.maps.LatLngBounds();
            this.infowindow = new google.maps.InfoWindow({
                content: 'carregando...'
            });
            this.initMap();
            this.insertMarkers();
        }
    }

    public initMap(): void {
        const mapOptions = {
            zoom: 4,
            center: new google.maps.LatLng(-15.106507, -53.169738),
            scrollwheel : false,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        this.map = new google.maps.Map(this.gmapElement.nativeElement, mapOptions);
        this.infowindowAddClass();
    }

    private insertMarkers(): void {
        const mapMarkers = [];
        let index = 0;
        if (this.properties) {
            this.properties.forEach(property => {
                mapMarkers[index] = new google.maps.Marker({
                    position: new google.maps.LatLng(property.latitude, property.longitude),
                    map: this.map,
                    title: '',
                    animation: google.maps.Animation.DROP,
                    icon: `${this._app.clientBucketPath()}/pin.png`
                });
                this.bindEvent(mapMarkers[index], property.longitude, property.latitude, index);
                this.setBounds(this.properties.length, mapMarkers[index].getPosition());
                index++;
            });
        }
    }

    private setBounds(lngth: number, position: any): void {
        if (lngth >= 1) {
            this.bounds.extend(position);
            this.map.fitBounds(this.bounds);
        } else {
            this.map.setCenter(position);
            this.map.setZoom(16);
        }
    }

    private infowindowAddClass(): void {
        google.maps.event.addListener(this.infowindow, 'domready', function() {
            $('.gm-style-iw').parent().addClass('tm-re-iw');
        });
    }

    private bindEvent(marker: any, lng: number, lat: number, index: number): void {
        google.maps.event.addListener(marker, 'click', () => {
            this.infowindow.open(this.map, marker);
            this.addMapItems(this.infowindow, index);
        });
    }

    private addMapItems(infowindow: any, propertyIndex: number) {
        let content = `
            <div id="location_infowindow" class="tm-map-pins__item clearfix tm-property-has-thumb">
                <div class="tm-property__inner">`;
        const property = this.properties[propertyIndex];
        content = content +  `
                <div class="infoWrapper">
                    <figure class="tm-property-info__image">
                    <a href="${(property.site_url) ? property.site_url : '/imovel/codigo/' + property.code}">
                `;
            if (property.cover_photo.url) {
                content = content +  `
                    <img
                        src="${property.cover_photo.url}" title="Mais detalhes"
                        class="attachment-cozyhouse-thumb-131-100 size-cozyhouse-thumb-131-100 wp-post-image"
                        alt="{{{{property.property_type}} em {{property.neighborhood}} - {{property.city}}/{{property.state}}}}"
                        height="100"
                        width="131"
                    >
                `;
            }

            if (property.cover_photo.url === '') {
                content = content + `
                    <img
                        src="https://imobzi.storage.googleapis.com/image/image-not-found.png" title="Mais detalhes"
                        class="attachment-cozyhouse-thumb-131-100 size-cozyhouse-thumb-131-100 wp-post-image"
                        alt="image not-fonud"
                        height="100"
                        width="131"
                    >
                `;
            }

            content = content + `
                </a>
            </figure>
                <div class="tm-property-info__content">
                    <div class="tm-property-info__title">
                        <a href="${(property.site_url)
                            ? property.site_url
                            : '/imovel/codigo/' + property.code}">
                            ${property.neighborhood}
                        </a>
                    </div>
                    <div class="tm-property-info__title titleSubtipo">
                        <a href="${(property.site_url)
                            ? property.site_url
                            : '/imovel/codigo/' + property.code}">
                            ${property.property_type}
                        </a>
                    </div>
        `;
        if (property.bedroom || property.suite || property.garage || property.useful_area) {
            content = content + `
                <div
                    class="tm-property__wrap template-sticked regular"
                    style="margin-left:0px; margin-right: 0px; display: block; margin-bottom: 0px;">

                    <div class="tm-property__attributes"
                        style="border: none!important; display: block; padding-bottom: 0px;margin-top: 5px;">
            `;
            if (property.bedroom) {
                content += `<span class="mapaCaracteristica">` + property.bedroom + ` Dorms</span>`;
            }
            if (property.suite) {
                content += `<span class="mapaCaracteristica">` + property.suite + ` Suítes</span>`;
            }
            if (property.garage) {
                content = content + `<span class="mapaCaracteristica">` + property.garage + ` Vagas</span>`;
            }
            if (property.useful_area) {
                content = content + `<span class="mapaCaracteristica">` + property.useful_area + ` m²</span>`;
            }
            content += `
                    </div>
                </div>
            `;
        }
        if (property.rental_value || property.sale_value) {
            if (property.rental_value) {
                content = content + `
                    <h6 class="tm-property-info__price">
                        ` + this.currencyPipe.transform(property.rental_value, 'BRL', 'symbol', '1.0-0')  + `
                    </h6>
                `;
            } else if (property.sale_value) {
                content = content + `
                    <h6 class="tm-property-info__price">
                        ` + this.currencyPipe.transform(property.sale_value, 'BRL', 'symbol', '1.0-0') + `
                    </h6>
                `;
            }
        }
        content += `
                    </div>
                    <div class="localizationWarning">
                        <span> A localização é aproximada</span>
                    </div>
                </div>
            </div>
        </div>
        `;
        infowindow.setContent(content);
    }
}
