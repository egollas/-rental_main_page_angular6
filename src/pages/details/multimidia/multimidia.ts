import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { PropertyMultimidia, PropertyPhoto } from '../../../interfaces/property';
import { AppService } from '../../../services/app.service';

@Component({
    selector: 'property-galery',
    templateUrl: './multimidia.html',
    styleUrls: ['./multimidia.scss']
})
export class MultimidiaComponent implements OnInit, AfterViewInit {

    @Input() photos: Array<PropertyPhoto>;
    @Input() multimidias: Array<PropertyMultimidia>;
    @ViewChild('photosBlock') photoSwiper: ElementRef;
    @ViewChild('thumbs') thumbSwiper: ElementRef;

    config: SwiperConfigInterface = {
        initialSlide: 0,
        spaceBetween: 4,
        observer: true,
        effect: 'slide',
        navigation: true,
        autoHeight: true,
        loop: true,
        grabCursor: true,
        centeredSlides: true,
        speed: 600,
    };

    thumbConfig: SwiperConfigInterface = {
        initialSlide: 0,
        spaceBetween: 4,
        centeredSlides: true,
        slidesPerView: 'auto',
        slideToClickedSlide: true,
        observer: true,
        loop: true,
        speed: 600,
    };

    public layoutBucketPath: string = this._app.layoutBucketPath();

    constructor(
        private _app: AppService,
        private domSanitinizer: DomSanitizer
    ) { }

    ngOnInit() {
        this.config.loopedSlides = this.photos.length + this.multimidias.length;
        this.thumbConfig.loopedSlides = this.photos.length + this.multimidias.length;
        this.multimidias.forEach(multimidia => {
            if (multimidia.category === 'videos' || multimidia.category === 'videos' ) {
                this.addVideoThumbnailImage(multimidia);
            } else {
                multimidia.url = this.domSanitinizer.bypassSecurityTrustResourceUrl(multimidia.url) as string;
                multimidia.thumbnail = this.layoutBucketPath + '/image/tour_360.jpg';
            }
        });
    }

    private addVideoThumbnailImage(multimidia: PropertyMultimidia) {
        const videoUrl = multimidia.url.match(/(youtu.be\/|v=)([\w\-]*)/);
        if (videoUrl) {
            const videoId = videoUrl[2];
            multimidia.url = this.domSanitinizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${videoId}`) as string;
            multimidia.thumbnail = `https://i3.ytimg.com/vi/${videoId}/default.jpg`;
        }
    }

    ngAfterViewInit() {
        this.photoSwiper.nativeElement.swiper.controller.control = this.thumbSwiper.nativeElement.swiper;
        this.thumbSwiper.nativeElement.swiper.controller.control = this.photoSwiper.nativeElement.swiper;
    }

}
