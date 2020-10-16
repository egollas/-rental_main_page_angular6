import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { IIntegration } from '../../interfaces/integration';
import { LayoutType } from '../../interfaces/layoutType';
import { Property, PropertySearchResultFields } from '../../interfaces/property';
import { SearchParams } from '../../interfaces/search-params';
import { AppService } from '../../services/app.service';
import { IntegrationService } from '../../services/integrations.service';
import { PropertyService } from '../../services/property.service';
import { removeHtmlTags, setPhotoUrlResize } from '../../utils/utils';
import { FiltersComponent } from './filters/filters';

declare var $: any;

@Component({
    selector: 'imobzi-search',
    templateUrl: './search.html',
    styleUrls: ['./search.scss'],
})
export class SearchPage implements OnInit, OnDestroy {

    @ViewChild('imobziFilters') imobziFilters: FiltersComponent;
    public properties: Array<Property>;
    public propertiesMap: Array<Property>;
    public filterFields: PropertySearchResultFields;
    public count: number;
    public cursor_generate = '';
    public queryParamsListening: Subscription;
    public searchParams: SearchParams = <SearchParams>{};
    public layoutBucketPath: string = this._app.layoutBucketPath();
    public startValue: number;
    public endValue: number;
    public searchStorage: SearchParams = <SearchParams>{};
    public map: boolean;
    public filtersShowTotal = true;
    public layoutType: LayoutType;

    constructor(
        private _properties: PropertyService,
        private route: ActivatedRoute,
        private changeDetector: ChangeDetectorRef,
        private _app: AppService,
        private _integration: IntegrationService,
        @Inject(PLATFORM_ID) private platformId: Object,
    ) { }

    ngOnInit() {
        this.layoutType = this._app.layoutType();
        this.googleMaps();
        this.searchStorage = JSON.parse(localStorage.getItem('search_params'));
        this.paramsUrlGet();
        if (isPlatformBrowser(this.platformId)) {
            document.getElementsByTagName('body')[0].className = '';
            document.getElementsByTagName('body')[0].classList.add(
                'search',
                'position-fullwidth',
                'sidebar-1-4',
                'tm_pb_builder',
                'position-one-left-sidebar'
            );
        }
    }

    ngOnDestroy() {
        if (this.queryParamsListening) {
            this.queryParamsListening.unsubscribe();
        }
    }

    googleMaps() {
        this.map = true;
        this._integration.getIntegrationByName('google_maps').subscribe((googleMaps: IIntegration) => {
            (googleMaps)
                ? this.map = true
                : this.map = false;
        });
    }

    private paramsUrlGet() {
        this.route.params.subscribe(param => {
            if (param['nickname']) {
                this.searchParams.nickname = param['nickname'];
            }
        });
        this.queryParamsListening = this.route.queryParams.subscribe(params => {
            this.defaultParams();
            // tslint:disable-next-line:forin
            for (const key in params) {
                const value = (Array.isArray(params[key])) ? params[key] : decodeURIComponent(params[key]);
                switch (key) {
                    case 'page':
                        if (value) {
                            this.searchParams[key] = Number(value);
                        } else {
                            this.searchParams[key] = 1;
                        }
                        break;
                    case 'order':
                    case 'availability':
                    case 'stage':
                        this.searchParams[key] = value;
                        break;
                    case 'value_min':
                        if (this.searchParams.values.length === 0) {
                            this.searchParams.values = [Number(value), Number(value)];
                        } else {
                            this.searchParams.values = [Number(value), this.searchParams.values[1]];
                        }
                        break;
                    case 'value_max':
                        if (this.searchParams.values.length === 0) {
                            this.searchParams.values = [Number(value), Number(value)];
                        } else {
                            this.searchParams.values = [this.searchParams.values[1], Number(value)];
                        }
                        break;
                    case 'garage':
                    case 'suite':
                    case 'bedroom':
                    case 'neighborhood':
                        if (this.searchParams[key + 's'].indexOf(value) === -1) {
                            this.searchParams[key + 's'].push(value);
                        }
                        break;
                    case 'area':
                        if (this.searchParams.area.indexOf(value) === -1) {
                            this.searchParams.area.push(value);
                        }
                        break;
                    case 'property_type':
                        if (this.searchParams.propertyTypes.indexOf(value) === -1) {
                            if (Array.isArray(value)) {
                                value.forEach(itemValue => {
                                    this.searchParams.propertyTypes.push(itemValue);
                                });
                            } else {
                                this.searchParams.propertyTypes.push(value);
                            }
                        }
                        break;
                    case 'cursor':
                        if (this.searchParams.cursors && value !== 'undefined') {
                            this.searchParams.cursors.push(value);
                        } else {
                            this.searchParams.cursors.push('');
                        }
                        break;
                    case 'city':
                        if (this.searchParams.cities.indexOf(value) === -1) {
                            this.searchParams.cities.push(value);
                        }
                        break;
                    case 'finality':
                        if (this.searchParams.propertyTypes.indexOf(value) === -1) {
                            if (Array.isArray(value)) {
                                value.forEach(itemValue => {
                                    this.searchParams.finality.push(itemValue);
                                });
                            } else {
                                this.searchParams.finality.push(value);
                            }
                        }
                        break;
                    case 'feature':
                        if (this.searchParams.feature.indexOf(value) === -1) {
                            if (Array.isArray(value)) {
                                value.forEach(itemValue => {
                                    this.searchParams.feature.push(itemValue);
                                });
                            } else {
                                this.searchParams.feature.push(value);
                            }
                        }
                        break;
                }
            }
            this.search();
            this.searchFields();
        });
    }

    private defaultParams() {
        this.searchStorage = JSON.parse(localStorage.getItem('search_params'));
        if (this.searchStorage != null) {
            this.searchParams = this.searchStorage;
        } else {
            this.searchParams = {
                order: 'neighborhood',
                availability: '',
                cities: [],
                neighborhoods: [],
                propertyTypes: [],
                area: [],
                values: [],
                bedrooms: [],
                suites: [],
                stage: '',
                garages: [],
                finality: [],
                feature: [],
                show_map: true,
                nickname: this.searchParams.nickname,
                page: 1,
                direction: '',
                cursors: []
            };
        }
    }

    searchByFilter() {
        localStorage.removeItem('search_params');
        this.searchParams.cursors = [''];
        this.search();
        this.searchFields();
    }

    public search() {
        this.changeLoading('block');
        this.searchStorage = JSON.parse(localStorage.getItem('search_params'));
        if (this.searchStorage) {
            this.searchParams = this.searchStorage;
            localStorage.removeItem('search_params');
        }
        this._properties.searchProperties(this.searchParams).subscribe(
            result => {
                this.count = result.properties.count;
                if (result.properties.count != null) {
                    this.cursor_generate = result.properties.cursor;
                }
                this.properties = result.properties.properties;
                this.properties.forEach(property => {
                    if (property.cover_photo && property.cover_photo.url) {
                        property.cover_photo.url = setPhotoUrlResize(property.cover_photo.url);
                    }
                    if (property.site_description) {
                        property.site_description = removeHtmlTags(property.site_description);
                    }
                });
                if (result.properties_map) {
                    this.propertiesMap = result.properties_map;
                }
                this.changeLoading('none');
            },
            () => {
                this.properties = [];
                this.propertiesMap = [];
                this.changeLoading('none');
            }
        );
        localStorage.setItem('search_params', JSON.stringify(this.searchParams));
    }

    public searchFields() {
        const searchReturnAllFields = this.filterFields ? false : true;
        this._properties.searchFields(this.searchParams, this.filtersShowTotal, searchReturnAllFields).subscribe(
            result => {
                if (result.values) {
                    this.startValue = result.values.min;
                    this.endValue = result.values.max;
                }
                if (!this.filterFields || Object.keys(this.filterFields).length <= 2) {
                    this.filterFields = result;
                } else {
                    Object.keys(this.filterFields).forEach(field => {
                        if (result[field]) {
                            if (field === 'values') {
                                this.filterFields.values = undefined;
                                this.changeDetector.detectChanges();
                            }
                            this.filterFields[field] = result[field];
                        }
                    });
                }
                this.imobziFilters.disableAllLoadings();
                this.changeDetector.detectChanges();
                this.updateSlider();
            }
        );
    }

    private updateSlider() {
        let mouseup: boolean;
        $('.nstSlider').nstSlider({
            left_grip_selector: '.leftGrip',
            right_grip_selector: '.rightGrip',
            value_bar_selector: '.bar',
            rounding: {
                '100': '1000',
                '1000': '5000',
                '5000': '10000',
                '10000': '25000',
                '25000': '50000',
                '50000': '75000',
                '75000': '100000',
                '100000': '125000',
                '125000': '150000',
                '150000': '175000',
                '175000': '200000',
                '200000': '250000',
                '250000': '350000',
                '350000': '500000',
                '500000': '750000',
                '750000': '1000000',
                '1000000': '1250000',
                '1250000': '1500000',
                '1500000': '1800000',
                '1800000': '2000000',
                '2000000': '5000000',
                '5000000': '10000000',
                '10000000': '100000000',
                '100000000': '1000000000'
            },
            set_range: {
                rangeMin: this.filterFields.values ? this.filterFields.values.min : 0,
                rangeMax: this.filterFields.values ? this.filterFields.values.max : 1,
            },
            value_changed_callback: (cause, leftValue, rightValue) => {
                if (mouseup) {
                    this.startValue = leftValue;
                    this.endValue = rightValue;
                    this.searchParams.values = [leftValue, rightValue];
                    this.changeDetector.detectChanges();
                }
            },
            user_mouseup_callback: () => {
                this.imobziFilters.changeValue();
                mouseup = true;
            },
            user_drag_start_callback: () => {
                mouseup = true;
            }

        });
    }

    private changeLoading(displayStyle: string = 'none') {
        document.getElementById('loading').style.display = displayStyle;
    }
}
