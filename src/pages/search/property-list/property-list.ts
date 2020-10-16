import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { Property, PropertySearchPagination } from '../../../interfaces/property';
import { SearchParams } from '../../../interfaces/search-params';

declare var jQuery: any;
declare var $: any;

@Component({
    selector: 'imobzi-property-list',
    templateUrl: './property-list.html',
    styleUrls: ['./property-list.scss']
})

export class PropertyListComponent implements OnChanges {

    @Input() properties: Array<Property>;
    @Input() searchParams: SearchParams;
    @Input() propertiesCount: number;
    @Input() propertiesCursorGenerate: string;
    @Output() searchParamsChange: EventEmitter<any> = new EventEmitter();
    public paginations: Array<number>;
    public paramsString: string;
    public propertyPagination: PropertySearchPagination;
    public pageUrl: string;
    public rentalSearch = false;

    changeOrder() {
        this.searchParams.page = 1;
        this.searchParams.direction = '';
        this.searchParams.cursors = [''];
        localStorage.removeItem('search_params');
        this.searchParams.show_map = false;
        this.searchParamsChange.emit(true);
    }

    ngOnChanges(change: any) {
        (this.searchParams.availability === 'rent') ? this.rentalSearch = true : this.rentalSearch = false;
        if (change['propertiesCount'] && this.propertiesCount) {
            this.paginations = Array.from(Array((parseInt(String(this.propertiesCount / 15), 0)))).map((x, i) => i + 1);
            this.propertyPagination = this.getPager(this.propertiesCount, this.searchParams.page ? this.searchParams.page : 1);
        }
        if (window) {
            this.pageUrl = window.location.pathname + window.location.search.replace('page=', 'old_page=');
        }
        if (!this.searchParams.page) {
            this.searchParams.page = 1;
        }
    }

    getPageUrl(pageNumber: string): string {
        return `${this.pageUrl}&page=${pageNumber}`;
    }

    previousPage(page: number) {
        if (page < 1 || page > this.paginations.length + 1) {
            return false;
        }
        this.propertyPagination = this.getPager(this.propertiesCount, page);
        this.searchParams.page = page;
        this.searchParams.show_map = false;
        if (!(this.searchParams.cursors[page - 1] || this.searchParams.cursors[page - 1] === '')) {
            this.searchParams.cursors[page - 1] = this.propertiesCursorGenerate;
        }
        localStorage.setItem('search_params', JSON.stringify(this.searchParams));
        this.searchParamsChange.emit(true);
        $('html,body').animate({scrollTop: $('#primary').offset().top}, 'slow');
        return false;

    }

    nextPage(page: number) {
        if (page < 1 || page > this.paginations.length + 1) {
            return false;
        }
        this.propertyPagination = this.getPager(this.propertiesCount, page);
        this.searchParams.page = page;
        this.searchParams.show_map = false;
        if (!(this.searchParams.cursors[page - 1] || this.searchParams.cursors[page - 1] === '')) {
            this.searchParams.cursors[page - 1] = this.propertiesCursorGenerate;
        }
        localStorage.setItem('search_params', JSON.stringify(this.searchParams));
        this.searchParamsChange.emit(true);
        $('html,body').animate({scrollTop: $('#primary').offset().top}, 'slow');
        return false;
    }

    firstPage(page: number) {
        this.searchParams.cursors = [''];
        this.searchParams.page = 1;
        this.searchParams.direction = '';
        this.propertyPagination = this.getPager(this.propertiesCount, page);
        this.searchParams.show_map = false;
        this.searchParamsChange.emit(true);
        return false;
    }

    lastPage(page: number) {
        this.searchParams.cursors = [];
        this.searchParams.cursors[page - 1] = '';
        this.searchParams.direction = 'desc';
        this.searchParams.page = page;
        this.propertyPagination = this.getPager(this.propertiesCount, page);
        this.searchParams.show_map = false;
        this.searchParamsChange.emit(true);
        return false;
    }

    changeListView(button: any) {
        const items = $('#visualizar_lista');
        const buttons = $('.tm-re-switch-layout__btn');
        const target    = $(button.target),
            form        = target.parents('form'),
            active      = 'tm-re-switch-layout__btn--active',
            listClass   = 'grid list',
            processing  = 'processing';

        if (target.hasClass( active )) {
            return false;
        }
        if (form.hasClass(processing)) {
            return false;
        }
        if (buttons.hasClass(active)) {
            buttons.removeClass(active);
        }
        form.addClass(processing);
        items.addClass(processing);
        target.addClass(active);
        form.removeClass(processing);
        items.removeClass(processing);
        items.toggleClass(listClass);
    }

    private getPager(totalItems: number, currentPage: number = 1, pageSize: number = 15) {
        const totalPages = Math.ceil(totalItems / pageSize);
        let startPageCount: number, startPage: number, endPage: number;
        if (totalPages <= 14) {
            startPage = 1;
            startPageCount = 1;
            endPage = totalPages;
        } else {
            if (currentPage <= 10) {
                startPage = 1;
                startPageCount = 1;
                endPage = 12;
            } else if ((totalPages - (currentPage - 4)) === 9) {
                startPage = currentPage - 5;
                startPageCount = currentPage - 5;
                endPage = currentPage + 5;
            } else if ((totalPages - (currentPage - 4)) < 9) {
                startPage = totalPages - 11;
                startPageCount = totalPages - 11;
                endPage = totalPages;
            } else {
                startPage = currentPage - 4;
                startPageCount = currentPage - 4;
                endPage = currentPage + 4;
            }
        }
        const pages: Array<number> = [];
        if (startPage && endPage) {
            for (startPage = startPage; startPage <= endPage; startPage ++) {
                pages.push(startPage);
            }
        }
        return {
            totalItems: totalItems,
            currentPage: currentPage,
            pageSize: pageSize,
            totalPages: totalPages,
            startPage: startPageCount,
            endPage: endPage,
            pages: pages,
            start: 1
        };
    }

}

