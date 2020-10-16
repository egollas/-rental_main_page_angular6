import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import 'rxjs/add/operator/debounceTime';
import { Subject } from 'rxjs/Subject';
import { PropertySearchResultFields } from '../../../interfaces/property';
import { SearchParams } from '../../../interfaces/search-params';

declare var $: any;
declare var jQuery: any;

@Component({
    selector: 'imobzi-filters',
    templateUrl: './filters.html',
    styleUrls: ['./filters.scss']
})

export class FiltersComponent implements OnInit {

    @Input() searchParams: SearchParams;
    @Input() filterFields: PropertySearchResultFields;
    @Input() startValue: number;
    @Input() endValue: number;
    @Input() filtersShowTotal: boolean;
    @Output() searchParamsChange: EventEmitter<any> = new EventEmitter();
    public rentalSearch = false;
    public rangeValues: Subject<number[]> = new Subject<number[]>();
    public startValue$: Subject<number> = new Subject<number>();
    public endValue$: Subject<number> = new Subject<number>();
    public loadings: object = {};

    ngOnInit() {
        this.setAllLoadings();
        this.rangeValues.debounceTime(300).subscribe(values => {
            this.emitChanges();
        });

        this.startValue$.debounceTime(1500).subscribe(value => {
            if (value < this.filterFields.values.min) {
                this.startValue = this.filterFields.values.min;
            }
            if (value > this.endValue) {
                this.endValue = +((value * 1.1).toFixed(0));
            }
            this.updateSliderRange(value, this.endValue);
            this.emitChanges();

        });

        this.endValue$.debounceTime(1500).subscribe(value => {
            if (value > this.filterFields.values.max) {
                this.endValue = this.filterFields.values.max;
            }
            if (value < this.startValue) {
                this.startValue = +((value * 0.9).toFixed(0));
            }
            this.updateSliderRange(this.startValue, value);
            this.emitChanges();
        });
    }

    private setAllLoadings() {
        const loadingsNames: Array<string> = [
            'areas', 'availabilities', 'bedrooms', 'cities', 'garages', 'neighborhoods', 'suites', 'types', 'values'
        ];
        loadingsNames.forEach(name => this.loadings[name] = true);
    }

    public disableAllLoadings() {
        Object.keys(this.loadings).forEach(key => this.loadings[key] = false);
    }

    private enableLoadings(exceptNames: Array<string>) {
        Object.keys(this.loadings).forEach(key => {
            if (exceptNames.indexOf(key) === -1) { this.loadings[key] = true; }
        });
    }

    public search() {
        (this.searchParams.availability === 'rent') ? this.rentalSearch = true : this.rentalSearch = false;
        this.resetChildFields('availability');
        this.emitChanges();
    }

    startValueChanged(value: number) {
        this.startValue$.next(value);
    }

    endValueChanged(value: number) {
        this.endValue$.next(value);
    }

    updateSliderRange(startValue: number, endValue: number) {
        $('.nstSlider').nstSlider('set_position', startValue, endValue);
        $('.nstSlider').nstSlider('refresh');
        this.inputChangeValue();
    }

    public inputChangeValue() {
        this.searchParams.values[0] = this.startValue;
        this.searchParams.values[1] = this.endValue;
        this.rangeValues.next(this.searchParams.values);
        this.resetChildFields('values');
    }

    public changeValue() {
        this.rangeValues.next(this.searchParams.values);
        this.resetChildFields('values');
    }

    public updateCities(event: any, city: string): void {
        if (event.target.checked) {
            this.searchParams.cities.push(city);
        } else {
            const index = this.searchParams.cities.indexOf(city, 0);
            this.searchParams.cities.splice(index, 1);
        }
        this.resetChildFields('cities');
        this.emitChanges();
    }

    public updateNeighborhoods(event: any, neighborhood: string): void {
        if (event.target.checked) {
            this.searchParams.neighborhoods.push(encodeURIComponent(neighborhood));

        } else {
            const index = this.searchParams.neighborhoods.indexOf(neighborhood, 0);
            this.searchParams.neighborhoods.splice(index, 1);
        }
        this.resetChildFields('neighborhoods');
        this.emitChanges();
    }

    public updatePropertyTypes(event: any, type: string): void {
        if (event.target.checked) {
            this.searchParams.propertyTypes.push(type);
        } else {
            const index = this.searchParams.propertyTypes.indexOf(type, 0);
            this.searchParams.propertyTypes.splice(index, 1);
        }
        this.resetChildFields('propertyTypes');
        this.emitChanges();
    }

    public updateArea(event: any, area: string): void {
        if (event.target.checked) {
            this.searchParams.area.push(area);
        } else {
            const index = this.searchParams.area.indexOf(area, 0);
            this.searchParams.area.splice(index, 1);
        }
        this.resetChildFields('area');
        this.emitChanges();
    }

    public updateBedrooms(event: any, quantity: number): void {
        const bedrooms = this.searchParams.bedrooms;

        if (event.target.checked) {
            bedrooms.push(quantity);
        } else {
            const index = bedrooms.indexOf(quantity, 0);
            bedrooms.splice(index, 1);
        }
        this.resetChildFields('bedrooms');
        this.emitChanges();
    }

    public updateSuites(event: any, quantity: number): void {
        const suites = this.searchParams.suites;

        if (event.target.checked) {
            suites.push(quantity);
        } else {
            const index = suites.indexOf(quantity, 0);
            suites.splice(index, 1);
        }
        this.resetChildFields('suites');
        this.emitChanges();
    }

    private resetChildFields(field: string) {

        let searchParamsNames: Array<string> = [];
        let filterFieldsNames: Array<string> = [];
        let loadingsNames: Array<string> = [];

        switch (field) {
            case 'availability':
                searchParamsNames = ['cities', 'neighborhoods', 'propertyTypes', 'area', 'values', 'bedrooms', 'suites', 'garages'];
                filterFieldsNames = ['cities', 'neighborhoods', 'property_types', 'area', 'areas', 'values', 'bedrooms', 'suites', 'garages'];
                loadingsNames = ['availabilities'];
                break;
            case 'cities':
                searchParamsNames = ['neighborhoods', 'propertyTypes', 'area', 'values', 'bedrooms', 'suites', 'garages'];
                filterFieldsNames = ['neighborhoods', 'property_types', 'area', 'areas', 'values', 'bedrooms', 'suites', 'garages'];
                loadingsNames = ['availabilities', 'cities'];
                break;
            case 'neighborhoods':
                searchParamsNames = ['propertyTypes', 'area', 'values', 'bedrooms', 'suites', 'garages'];
                filterFieldsNames = ['property_types', 'area', 'areas', 'values', 'bedrooms', 'suites', 'garages'];
                loadingsNames = ['availabilities', 'cities', 'neighborhoods'];
                break;
            case 'propertyTypes':
                searchParamsNames = ['area', 'values', 'bedrooms', 'suites', 'garages'];
                filterFieldsNames = ['area', 'areas', 'values', 'bedrooms', 'suites', 'garages'];
                loadingsNames = ['availabilities', 'cities', 'neighborhoods', 'types'];
                break;
            case 'area':
                filterFieldsNames = searchParamsNames = ['values', 'bedrooms', 'suites', 'garages'];
                loadingsNames = ['availabilities', 'cities', 'neighborhoods', 'types', 'areas'];
                break;
            case 'values':
                filterFieldsNames = searchParamsNames = ['bedrooms', 'suites', 'garages'];
                loadingsNames = ['availabilities', 'cities', 'neighborhoods', 'types', 'areas', 'values'];
                break;
            case 'bedrooms':
                filterFieldsNames = searchParamsNames = ['suites', 'garages'];
                loadingsNames = ['availabilities', 'cities', 'neighborhoods', 'types', 'areas', 'values', 'bedrooms'];
                break;
            case 'suites':
                filterFieldsNames = searchParamsNames = ['garages'];
                loadingsNames = ['availabilities', 'cities', 'neighborhoods', 'types', 'areas', 'values', 'bedrooms', 'suites'];
                break;
        }

        if (searchParamsNames !== []) { searchParamsNames.forEach(name => this.searchParams[name] = []); }
        if (filterFieldsNames !== []) { filterFieldsNames.forEach(name => this.filterFields[name] = undefined); }
        if (loadingsNames     !== []) { this.enableLoadings(loadingsNames); }
    }

    public updateGarages(event: any, quantity: number): void {
        const spots = this.searchParams.garages;

        if (event.target.checked) {
            spots.push(quantity);
        } else {
            const index = spots.indexOf(quantity, 0);
            spots.splice(index, 1);
        }
        this.emitChanges();
    }

    public toggleList(category: string): void {
        const isToggled = $(category).find('.checkbox-list').hasClass('checkbox-list-expanded');
        if (isToggled) {
            $(category).find('.checkbox-list').removeClass('checkbox-list-expanded');
            $(category).find('.minusIcon').css({'display' : 'none'});
            $(category).find('.minusSpan').css({'display' : 'none'});
            $(category).find('.plusIcon').css({'display' : 'block'});
            $(category).find('.plusSpan').css({'display' : 'inline'});
        } else {
            $(category).find('.checkbox-list').addClass('checkbox-list-expanded');
            $(category).find('.minusIcon').css({'display' : 'block'});
            $(category).find('.minusSpan').css({'display' : 'inline'});
            $(category).find('.plusIcon').css({'display' : 'none'});
            $(category).find('.plusSpan').css({'display' : 'none'});
        }
    }

    private emitChanges() {
        this.searchParams.page = 1;
        this.searchParams.show_map = true;
        this.searchParamsChange.emit(true);
    }
}
