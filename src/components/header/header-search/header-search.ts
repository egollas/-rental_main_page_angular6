import { Component } from '@angular/core';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ICityNeighborhoodSearch } from '../../../interfaces/autocomplete-search';
import { ICity } from '../../../interfaces/city';
import { INeighborhood } from '../../../interfaces/neighborhood';
import { SearchAvailabilityTypes } from '../../../interfaces/property';
import { PropertyService } from '../../../services/property.service';

declare var jQuery: any;
declare var $: any;

@Component({
    selector: 'header-search',
    templateUrl: './header-search.html',
    styleUrls: ['./header-search.scss']
})
export class HeaderSearchComponent implements OnInit {

    public propertyTypesSearch: SearchAvailabilityTypes;
    public availabilitySelected: string;
    public typeSelected: string;
    public searchText: string;
    public suggestions: Array<ICityNeighborhoodSearch> = [];
    public headerSearch: NgForm;

    constructor(
        private router: Router,
        private _propertyService: PropertyService
    ) { }

    ngOnInit() {
        this._propertyService.searchPropertyTypes().subscribe(propertyTypesSearch => {
            if (propertyTypesSearch && Object.keys(propertyTypesSearch).length > 0) {
                this.propertyTypesSearch = propertyTypesSearch;
                if (this.propertyTypesSearch.buy && this.propertyTypesSearch.buy.length > 0) {
                    this.availabilitySelected = 'buy';
                } else {
                    this.availabilitySelected = Object.keys(propertyTypesSearch)[0];
                }
                this.typeSelected = '';
            }
        });
        this._propertyService.propertyNeighborhoods().subscribe(
            neighborhoods => {
                neighborhoods.forEach(neighborhood => {
                    this.neighborhoodAddToSuggestion(neighborhood);
                    if (!this.cityInSuggestions(neighborhood.city)) {
                        this.cityAddToSuggestion(neighborhood.city);
                    }
                });
                this.suggestions.sort((suggestion1, suggestion2) => {
                    if (suggestion1.category > suggestion2.category) {
                        return -1;
                    }
                    return 1;
                });
                this.initiAutocompleteSearch();
            }
        );
    }

    private cityAddToSuggestion(city: ICity) {
        this.suggestions.push({
            label: `${city.name} - ${city.administrative_area_level_1}`,
            city: city.name,
            state: city.administrative_area_level_1,
            category: 'Cidade'
        });
    }

    private cityInSuggestions(city: ICity): boolean {
        let cityExistsInSuggestions: boolean;
        const citySuggestions: Array<ICityNeighborhoodSearch> = this.suggestions.filter(suggestion => suggestion.category === 'Cidade');
        if (citySuggestions.length > 0) {
            citySuggestions.forEach(citySuggestion => {
                if (citySuggestion.city.toLowerCase() === city.name.toLowerCase()
                    && citySuggestion.state.toLowerCase() === city.administrative_area_level_1.toLowerCase()) {
                    cityExistsInSuggestions = true;
                }
            });
        }
        return cityExistsInSuggestions;
    }

    private neighborhoodAddToSuggestion(neighborhood: INeighborhood) {
        this.suggestions.push({
            label: `${neighborhood.name}, ${neighborhood.city.name} - ${neighborhood.city.administrative_area_level_1}`,
            neighborhood: neighborhood.name,
            city: neighborhood.city.name,
            state: neighborhood.city.administrative_area_level_1,
            category: 'Bairro'
        });
    }

    translateAvailability(availability: string) {
        switch (availability) {
            case 'buy':
                return 'Venda';
            case 'rent':
                return 'Alugar';
            case 'vacation_rental':
                return 'Temporada';
            default:
                return availability;
        }
    }

    clearSearch() {
        this.typeSelected = '';
        this.searchText = '';
    }

    private initiAutocompleteSearch() {
        $.widget('custom.catcomplete', $.ui.autocomplete, {
            _create: function () {
                this._super();
                this.widget().menu('option', 'items', '> :not(.ui-autocomplete-category)');
            },
            _renderMenu: function (ul, items) {
                const that = this;
                let currentCategory = '';
                $.each(items, function (index, item) {
                    let li;
                    if (item.category !== currentCategory) {
                        ul.append('<li class=\'ui-autocomplete-category\'>' + item.category + '</li>');
                        currentCategory = item.category;
                    }
                    li = that._renderItemData(ul, item);
                });
            }
        });
        $('#autocomplete').keydown((event) => {
            if (event.which === 13) {
                event.preventDefault();
            }
        })
            .catcomplete({
                delay: 100,
                autoFocus: true,
                source: (request, response) => {
                    const matcher = new RegExp($.ui.autocomplete.escapeRegex(request.term), 'i');
                    response($.grep(this.suggestions, (suggestion: ICityNeighborhoodSearch) => {
                        return matcher.test(suggestion.label) || matcher.test(this.normalize(suggestion.label));
                    }).slice(0, 50));
                },
                select: (element, ui) => {
                    this.searchText = ui.item.label;
                    this.router.navigate(['/buscar'], {
                        queryParams: {
                            'availability': this.availabilitySelected,
                            'property_type': this.typeSelected,
                            'neighborhood': ui.item.neighborhood || '',
                            'city': ui.item.city || '',
                        }
                    });
                    localStorage.removeItem('search_params');
                    return false;
                }
            });
    }

    AdvancedSearch() {
        localStorage.removeItem('search_params');
        this.router.navigate(['/buscar'], {
            queryParams: {
                'availability': '',
                'property_type': '',
                'cursor': ''
            }
        });
    }

    isNumber() {
        if (Number(this.searchText)) {
            this.submitForm(this.headerSearch);
        }
    }

    public submitForm(form: NgForm): void {
        localStorage.removeItem('search_params');
        if (Number(this.searchText)) {
            this._propertyService.getProperty(`${this.searchText}`).subscribe(
                propertyUrl => this.router.navigate([propertyUrl.site_url]),
                error => this.router.navigate(['imovel-nao-encontrado']),
            );
        } else {
            this.router.navigate(['/buscar'], {
                queryParams: {
                    'availability': this.availabilitySelected,
                    'property_type': this.typeSelected,
                    'cursor': ''
                }
            });
        }
    }

    private normalize(term) {
        const accentMap = {
            'á': 'a', 'à': 'a', 'ã': 'a',
            'é': 'e', 'è': 'e', 'ê': 'e',
            'í': 'i', 'ì': 'i', 'ó': 'o',
            'ò': 'o', 'ô': 'o', 'õ': 'o',
            'ú': 'u', 'ù': 'u', 'ü': 'u',
            'ç': 'c'
        };
        let ret = '';
        for (let i = 0; i < term.length; i++) {
            ret += accentMap[term.charAt(i)] || term.charAt(i);
        }
        return ret;
    }

}
