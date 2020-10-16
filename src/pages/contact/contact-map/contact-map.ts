import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import { Parameters } from '../../../interfaces/parameters';
import { AppService } from '../../../services/app.service';
import { ParametersService } from '../../../services/parameters.service';

declare var google: any;
declare var $: any;

@Component({
    selector: 'imobzi-contact-map',
    templateUrl: './contact-map.html',
    styleUrls: ['./contact-map.scss']
})
export class ContactLocationComponent implements OnChanges {

    @ViewChild('location') gmapElement: any;
    @Input() parameters: Parameters;
    map: google.maps.Map;
    infowindow: any;

    constructor (
        public _parameters: ParametersService,
        private _app: AppService
    ) { }

    ngOnChanges(change: any) {
        if (document.getElementById('googleMapsScript')) {
            this.infowindow = new google.maps.InfoWindow({
                content: 'carregando...'
            });
            this.initMap();
        }
    }

    private initMap(): void {
        const mapOptions = {
            zoom: 16,
            center: new google.maps.LatLng(this.parameters.latitude, this.parameters.longitude),
            scrollwheel : false,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        this.map = new google.maps.Map(this.gmapElement.nativeElement, mapOptions);
        this.insertMarker();
        this.infowindowAddClass();
    }

    private insertMarker(): void {
        const mapMarker = new google.maps.Marker({
            position: new google.maps.LatLng(this.parameters.latitude, this.parameters.longitude),
            map: this.map,
            title: '',
            animation: google.maps.Animation.DROP,
            icon: `${this._app.clientBucketPath()}/pin.png`
        });

        this.map.setCenter(mapMarker.getPosition());
        this.bindEvent(mapMarker, this.parameters.latitude, this.parameters.longitude);
    }

    private infowindowAddClass(): void {
        google.maps.event.addListener(this.infowindow, 'domready', function() {
            $('.gm-style-iw').parent().addClass('tm-re-iw');
        });
    }

    private bindEvent(marker: any, lng: number, lat: number): void {
        google.maps.event.addListener(marker, 'click', (event) => {
            this.infowindow.open(this.map, marker);
            this.createContent(
                this.infowindow,
                marker, this.parameters.latitude, this.parameters.longitude
            );
        });
    }

    private createContent(infowindow: any, marker: any, lng: number, lat: number): void {
        let content = `${this.parameters.address}, </br> ${this.parameters.neighborhood},
                ${this.parameters.city} - ${this.parameters.state}</br>`;
        infowindow.setContent(content);
        content = '';
    }
}
