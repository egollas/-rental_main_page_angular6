import { Component, Input, OnInit, ViewChild, OnChanges } from '@angular/core';
import { AppService } from '../../../services/app.service';

declare var google: any;
declare var $: any;

const showAddressComplete = false; // if the client wants to show the full address, enable variable 'showAddressComplete'

@Component({
    selector: 'imobzi-property-location',
    templateUrl: './property-location.html',
    styleUrls: ['./property-location.scss']
})

export class PropertyLocationComponent implements OnChanges {

    constructor (
        private _app: AppService
    ) { }

    @Input() lgn: number;
    @Input() lat: number;
    @Input() adr: string;
    @Input() nbh: string;
    @Input() cit: string;
    @Input() stt: string;
    @Input() showMarker: boolean;
    @ViewChild('location') gmapElement;

    public map: google.maps.Map;
    public addressComplete: any;
    public infowindow: any;

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
            zoom: 15,
            center: new google.maps.LatLng(-15.106507, -53.169738),
            scrollwheel : false,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            showMarker: true
        };
        this.map = new google.maps.Map(this.gmapElement.nativeElement, mapOptions);
        this.showAddress();
        this.insertMarker();
        this.infowindowAddClass();
    }

    private insertMarker(): void {
        let mapMarker = [];
        const location = new google.maps.LatLng(this.lat , this.lgn);
        if (this.adr) {
            mapMarker = new google.maps.Marker({
                position: location,
                map: this.map,
                title: '',
                animation: google.maps.Animation.DROP,
                icon: `${this._app.clientBucketPath()}/pin.png`
            });
        } else {
            const mapCircle = new google.maps.Circle({
                strokeColor: '#C0C0C0',
                strokeOpacity: 5.5,
                strokeWeight: 3,
                fillColor: '#C0C0C0',
                fillOpacity: 0.35,
                map: this.map,
                scrollwheel : false,
                center: location,
                radius: 500
            });
        }
        this.map.setCenter(location);
        this.bindEvent(mapMarker, this.lat, this.lgn);
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
                marker, lng, lat
            );
        });
    }

    private createContent(infowindow: any, marker: any, lng: number, lat: number): void {
        if (showAddressComplete) {
            let content_complete = `${this.adr} </br> ${this.nbh} - ${this.cit} - ${this.stt}</br>`;
            infowindow.setContent(content_complete);
            content_complete = '';
        } else {
            let content_complete = `${this.adr.split(', ', 1)} </br> ${this.nbh} - ${this.cit} - ${this.stt}</br>`;
            infowindow.setContent(content_complete);
            content_complete = '';
        }
    }

    private showAddress() {
        if (this.adr) {
            ((this.adr) && (showAddressComplete))
                ? this.addressComplete =  `Endereço: ${this.adr} - ${this.nbh} - ${this.cit} - ${this.stt}`
                : this.addressComplete =  `Endereço: ${this.adr.split(', ', 1)} - ${this.nbh} - ${this.cit} - ${this.stt}`;
        } else {
            this.addressComplete = '';
        }
    }
}
