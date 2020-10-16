import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import Swiper from 'swiper';
import { lazyDefaultImage } from '../../environments/environment.prod';
import { Property } from '../../interfaces/property';

@Component({
  selector: 'highlight-gallery',
  templateUrl: 'highlight-gallery.html',
  styleUrls: ['highlight-gallery.scss']
})
export class HighlightGalleryComponent implements OnInit, AfterViewInit {

    @Input() properties: Array<Property>;
    public lazyLoadImage: string;

    constructor() { }

    public translateFinality(finality: string) {
        switch (finality) {
            case 'residential':
                return 'Residencial';
            case 'commercial':
                return 'Comercial';
            case 'Rural':
            case 'rural':
                return 'Rural';
            default:
                return finality;
        }
    }

    ngOnInit() {
        this.lazyLoadImage = lazyDefaultImage;
    }

    ngAfterViewInit() {
        const mySwiper: any = new Swiper('#destaque-rotativo', {
            autoplay: {
                delay: 3000,
                disableOnInteraction: false
            },
            speed: 600,
            loop: true,
            loopedSlides: this.properties.length,
            preloadImages: false,
            lazy: true,
            grabCursor: true,
            effect: 'slide',
            direction: 'horizontal',
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            }
        });
    }

}
