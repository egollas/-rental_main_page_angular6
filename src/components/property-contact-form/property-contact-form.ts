import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SiteContact } from '../../interfaces/contact';
import { FormService } from '../../services/form.service';

declare var jQuery: any;
declare var $: any;
declare var calendarUnavailableDates: any;
declare var checkAvailability: any;

@Component({
    selector: 'property-contact-form',
    templateUrl: './property-contact-form.html',
    styleUrls: ['./property-contact-form.scss']
})
export class PropertyContactFormComponent implements OnInit, AfterViewInit {

    @Input() propertyCode: string;
    @Input() vacationRental: boolean;
    public contact: SiteContact = <SiteContact>{};
    public subjects = [
        'Agendar uma visita',
        'Interessado em comprar',
        'Interessado em alugar',
        'Outros'
    ];
    public message = `Olá, tenho interesse neste imóvel que vi no seu site e gostaria de receber mais informações. Aguardo contato. Obrigado.`;
    public displaySuccess: boolean;
    public displayFailure: boolean;

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private _formService: FormService,
    ) { }

    ngOnInit() {
        this.contact.message = this.message;
        if (this.propertyCode) {
            this.contact.property_code = this.propertyCode;
        }
        if (this.vacationRental) {
            this.subjects.push('Interessado em reservar');
        }
        if (isPlatformBrowser(this.platformId)) {
            if (($(window).width() > 768) && ($(window).height() > 654)) {
                $(window).scroll(function() {
                const widgetAreaHeight = $('#help-window').height();
                const widgetHeight = $('#contactForm').height();
                const scrolledFromtop = $(window).scrollTop();
                const startFix = 257 - 115;
                const stopFix = widgetAreaHeight - widgetHeight + startFix;
                if (scrolledFromtop > stopFix) {
                    $('#contactForm').removeClass('scrolled');
                    $('#contactForm').addClass('scrolledToTheBottom');
                } else if ((scrolledFromtop > startFix) && (scrolledFromtop < stopFix)) {
                    $('#contactForm').addClass('scrolled');
                    $('#contactForm').removeClass('scrolledToTheBottom');
                } else {
                    $('#contactForm').removeClass('scrolled');
                    $('#contactForm').removeClass('scrolledToTheBottom');
                }
                });
            }
        }
        this.contact.subject = this.subjects[0];
    }

    ngAfterViewInit() {
        if (isPlatformBrowser(this.platformId)) {
            if (this.vacationRental) {
                this.detailContactCalendar();
                Object.defineProperty(window, 'checkAvailability', {value: function() {
                    const calendar = $('#callendary');
                    let valido = true;
                    if (calendar.length > 0) {
                        const from_date   = $('#from').datepicker('getDate');
                        const to_date     = $('#to').datepicker('getDate');
                        const data_inicio = $.datepicker.formatDate('yy-mm-dd', from_date);
                        const data_fim    = $.datepicker.formatDate('yy-mm-dd', to_date);
                        const data_hoje    = $.datepicker.formatDate('yy-mm-dd', new Date);
                        if ($('#subject').val().search(/Interessado em reservar/) >= 0) {
                            $.each(calendarUnavailableDates, function(key, dia) {
                                if ((data_inicio && data_inicio < dia) && (data_fim && data_fim > dia)
                                        || (data_fim && data_fim < data_hoje)) {
                                    valido = false;
                                    return false;
                                }
                            });
                        }
                        if (!valido) {
                            $('#mensagem_detalhe_data').show();
                        } else {
                            $('#mensagem_detalhe_data').hide();
                        }
                    }
                    return true;
                }});
            }
        }
    }

    private validateDate(): boolean {
        if (this.contact.start && this.contact.end || !this.vacationRental) {
            return true;
        } else {
            return false;
        }
    }

    submitForm(form: NgForm): void {

        this.contact.start = $( '#from' ).val();
        this.contact.end = $( '#to' ).val();

        if (form.valid && this.validateDate()) {
            this._formService.contact(this.contact).subscribe(
                () => {
                    form.reset();
                    this.displaySuccess = true;
                    this.displayFailure = false;
                },
                () => this.displayFailure = true
            );
        } else {
            this.displayFailure = true;
        }
    }

    private detailContactCalendar() {
        $('#from').datepicker({
            defaultDate: new Date(),
            dateFormat: 'dd/mm/yy',
            dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
            dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S', 'D'],
            dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
            monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
            monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
            nextText: 'Próximo',
            prevText: 'Anterior',
            changeMonth: false,
            minDate: new Date(),
            numberOfMonths: 1,
            beforeShowDay: function(date) {
            const string = jQuery.datepicker.formatDate('yy-mm-dd', date);
            return [ calendarUnavailableDates.indexOf(string) === -1 ];
            },
            onClose: function(selectedDate) {
                $('#to').datepicker('option', 'minDate', selectedDate);
                checkAvailability.call();
            }
        });

        $('#to').datepicker({
            defaultDate: new Date(),
            dateFormat: 'dd/mm/yy',
            dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
            dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S', 'D'],
            dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
            monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho',
                        'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
            monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
            nextText: 'Próximo',
            prevText: 'Anterior',
            changeMonth: false,
            minDate: new Date(),
            numberOfMonths: 1,
            beforeShowDay: function(date) {
                const string = jQuery.datepicker.formatDate('yy-mm-dd', date);
                return [ calendarUnavailableDates.indexOf(string) === -1 ];
            },
            onClose: function(selectedDate) {
                $('#from').datepicker('option', 'maxDate', selectedDate);
                checkAvailability.call();
            }
        });
    }

}
