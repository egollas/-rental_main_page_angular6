import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { LayoutType } from '../../interfaces/layoutType';
import { Property, PropertyHighlights } from '../../interfaces/property';
import { AppService } from '../../services/app.service';
import { PropertyService } from '../../services/property.service';
import { removeHtmlTags, setPhotoUrlResize } from '../../utils/utils';

@Component({
    selector: 'imobzi-home',
    templateUrl: './home.html',
    styleUrls: ['./home.scss']
})
export class HomePage implements OnInit {

    public layoutBucketPath: string = this._app.layoutBucketPath();
    public propertyHighlights: PropertyHighlights;
    public propertiesMap: Array<Property>;
    public propertiesGallery: Array<Property>;
    public propertiesSection1: Array<Property>;
    public propertiesSection2: Array<Property>;
    public propertiesFooter: Array<Property>;
    public layoutType: LayoutType;

    constructor(
        private _app: AppService,
        private _propertyService: PropertyService,
        @Inject(PLATFORM_ID) private platformId: Object,
    ) { }

    ngOnInit() {
        this.layoutType = this._app.layoutType();
        if (isPlatformBrowser(this.platformId)) {
            this.changeLoading('block');
            document.getElementsByTagName('body')[0].className = '';
            document.getElementsByTagName('body')[0].classList.add(
                'home',
                'page',
                'position-fullwidth',
                'sidebar-1-4',
                'tm_pb_builder'
            );
        }
        this._propertyService.getHighlights().subscribe(
            highlights => {
                this.propertyHighlights = highlights.highlights;
                Object.keys(this.propertyHighlights).forEach((propertyHighlightKey, index) => {
                    switch (index) {
                        case 0:
                            this.propertiesSection1 = this.propertyHighlights[propertyHighlightKey];
                            break;
                        case 1:
                            this.propertiesSection2 = this.propertyHighlights[propertyHighlightKey];
                            break;
                        case 2:
                            this.propertiesFooter = this.propertyHighlights[propertyHighlightKey];
                            break;
                    }
                    const photoSize: number = (index === 0) ? 796 : 295;
                    this.propertyHighlights[propertyHighlightKey].forEach((property, propertyIndex) => {
                        if (property.cover_photo && property.cover_photo.url) {
                            property.cover_photo.url = setPhotoUrlResize(
                                property.cover_photo.url, (index !== 0 && propertyIndex === 0) ? 648 : photoSize);
                        }
                        if (property.site_description) {
                            property.site_description = removeHtmlTags(property.site_description);
                        }
                    });
                });
                this.propertiesMap = highlights.properties_map;
                this.changeLoading();
            },
            () => this.changeLoading()
        );
    }

    private changeLoading(displayStyle: string = 'none') {
        const loading = document.getElementById('loading');
        loading.style.display = displayStyle;
    }


}
