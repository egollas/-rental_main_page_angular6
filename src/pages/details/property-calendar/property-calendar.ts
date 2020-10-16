import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { PropertyCalendar } from '../../../interfaces/property';

declare var jQuery: any;
declare var $: any;
declare var onDrawCal: any;
declare var calendarUnavailableDates: Array<string>;
declare var calendarUnavailableIds: Array<string>;
declare var calendarFirstPeriodIds: Array<string>;
declare var calendarLastPeriodIds: Array<string>;

@Component({
    selector: 'property-calendar',
    templateUrl: './property-calendar.html',
    styleUrls: ['./property-calendar.scss']
})

export class PropertyCalendarComponent implements OnInit, AfterViewInit {

    @Input() propertyCalendar: Array<PropertyCalendar>;

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
    ) { }

    ngOnInit() {
        const unavailableDates: Array<string> = [];
        const unavailableIds: Array<string> = [];
        const firstPeriodIds: Array<string> = [];
        const lastPeriodIds: Array<string> = [];
        this.propertyCalendar.forEach(calendarItem => {
            const initialDate: Date = new Date(calendarItem.initial_date.substr(0, 10));
            unavailableDates.push(`${initialDate.getUTCFullYear()}-${initialDate.getUTCMonth() + 1}-${initialDate.getUTCDate()}`);
            firstPeriodIds.push(`#c1d_${initialDate.getUTCMonth() + 1}_${initialDate.getUTCDate()}_${initialDate.getUTCFullYear()}`);
                firstPeriodIds.push(`#c2d_${initialDate.getUTCMonth() + 1}_${initialDate.getUTCDate()}_${initialDate.getUTCFullYear()}`);
            const finalDate: Date = new Date(calendarItem.final_date.substr(0, 10));
            lastPeriodIds.push(`#c1d_${finalDate.getUTCMonth() + 1}_${finalDate.getUTCDate()}_${finalDate.getUTCFullYear()}`);
            lastPeriodIds.push(`#c2d_${finalDate.getUTCMonth() + 1}_${finalDate.getUTCDate()}_${finalDate.getUTCFullYear()}`);
            initialDate.setDate(initialDate.getDate() + 1);
            while (initialDate < finalDate) {
                unavailableDates.push(`${initialDate.getUTCFullYear()}-${initialDate.getUTCMonth() + 1}-${initialDate.getUTCDate()}`);
                unavailableIds.push(
                    `#c1d_${initialDate.getUTCMonth() + 1}_${initialDate.getUTCDate()}_${initialDate.getUTCFullYear()}`);
                unavailableIds.push(
                    `#c2d_${initialDate.getUTCMonth() + 1}_${initialDate.getUTCDate()}_${initialDate.getUTCFullYear()}`);
                initialDate.setDate(initialDate.getDate() + 1);
            }
            unavailableDates.push(`${finalDate.getUTCFullYear()}-${finalDate.getUTCMonth() + 1}-${finalDate.getUTCDate()}`);
        });
        Object.defineProperty(window, 'calendarUnavailableDates', {value: unavailableDates});
        Object.defineProperty(window, 'calendarUnavailableIds', {value: unavailableIds});
        Object.defineProperty(window, 'calendarFirstPeriodIds', {value: firstPeriodIds});
        Object.defineProperty(window, 'calendarLastPeriodIds', {value: lastPeriodIds});
    }

    ngAfterViewInit() {
        if (isPlatformBrowser(this.platformId)) {
            this.updateCalendar();
            Object.defineProperty(window, 'onDrawCal', {value: function() {
                $(calendarUnavailableIds.join(',')).addClass('diasindisponiveis');
                $(calendarFirstPeriodIds.join(',')).addClass('primeirodia_indisponivel');
                $(calendarLastPeriodIds.join(',')).addClass('ultimodia_indisponivel');
                $('.jCalMo').removeClass('col-xl-6 col-lg-6 col-md-12 col-sm-12 col-xs-12');
                $('.jCalMo').addClass('col-xl-6 col-lg-6 col-md-12 col-sm-12 col-xs-12');
                $('#callendary .left').html('<i class="material-icons">keyboard_arrow_left</i> <span>Anterior</span>');
                $('#callendary .right').html('<i class="material-icons">keyboard_arrow_right</i> <span>Proxímo</span>');
            }});
        }
    }

    private updateCalendar() {
        $('#callendary').jCal();
        $('.jCalMo .left').html('<i class="material-icons">keyboard_arrow_left</i> <span>Anterior</span>');
        $('#callendary .right').html('<i class="material-icons">keyboard_arrow_right</i> <span>Proximo</span>');
        $('.jCalMo').removeClass('col-xl-6 col-lg-6 col-md-12 col-sm-12 col-xs-12');
        $('.jCalMo').addClass('col-xl-6 col-lg-6 col-md-12 col-sm-12 col-xs-12');
        this.setCalendarUnavailableDays();
    }

    private setCalendarUnavailableDays() {
        $(calendarUnavailableIds.join(',')).addClass('diasindisponiveis');
        $(calendarFirstPeriodIds.join(',')).addClass('primeirodia_indisponivel');
        $(calendarLastPeriodIds.join(',')).addClass('ultimodia_indisponivel');
    }

}
