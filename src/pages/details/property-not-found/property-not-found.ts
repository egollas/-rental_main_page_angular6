import { isPlatformBrowser, Location } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'property-not-found',
    templateUrl: './property-not-found.html',
    styleUrls: ['./property-not-found.scss']
})
export class PropertyNotFound implements OnInit {

    constructor(
        private title: Title,
        private location: Location,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    ngOnInit() {
        this.title.setTitle('Imóvel não encontrado | ' + this.title.getTitle());
        if (isPlatformBrowser(this.platformId)) {
            document.getElementsByTagName('body')[0].className = '';
            document.getElementsByTagName('body')[0].classList.add(
                'tm-property--single',
                'single',
                'single-tm-property',
                'position-one-left-sidebar'
            );
        }
    }

    goBack() {
        this.location.back();
    }
}
