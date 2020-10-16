import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { NgForm } from '@angular/forms';
import { JoinInUs } from '../../interfaces/contact';
import { FormService } from '../../services/form.service';

declare var $: any;

@Component({
    selector: 'join-in-us',
    templateUrl: './join-in-us.html',
    styleUrls: ['./join-in-us.scss']
})

export class JoinInUsForm implements OnInit {

    public contact: JoinInUs = <JoinInUs>{};
    public messageSend: string;
    public states: Array<string>;
    public zipCode: boolean;
    public submitForm: boolean;

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private _form: FormService,
        private _http: HttpClient
    ) { }

    ngOnInit() {
        this.submitForm = false;
        this.states = [
            'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
            'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
        ];
        this.contact.state = 'AC';
        if (isPlatformBrowser(this.platformId)) {
            document.getElementsByTagName('body')[0].className = '';
            document.getElementsByTagName('body')[0].classList.add(
                'page',
                'position-one-left-sidebar',
                'sidebar-1-4', 'tm_pb_builder'
            );
        }
    }

    getAddressByZipCode() {
        if (this.contact.zipcode) {
            this.changeLoading('block');
            this._http.get('https://viacep.com.br/ws/' + this.contact.zipcode + '/json').subscribe(
                address => {
                    this.changeLoading();
                    if (!address['erro']) {
                        this.contact.address = address['logradouro'];
                        this.contact.neighborhood = address['bairro'];
                        this.contact.city = address['localidade'];
                        this.contact.state = address['uf'];
                    } else {
                        console.log(address['erro']);
                        this.zipCode = address['erro'];
                    }
                },
                () => this.changeLoading()
            );
        }
    }

    private changeLoading(displayStyle: string = 'none') {
        document.getElementById('loading').style.display = displayStyle;
    }

    submit(form: NgForm) {
        if (form.valid) {
            this._form.sendCustomForm(form.form.value).subscribe(response => {
                form.resetForm();
                this.submitForm = true;
                this.messageSend = 'A sua mensagem foi enviada com sucesso!';
            }, error => {
                const message_element = $('#mensagens');
                const errorMessage: string = JSON.parse(error._body)['message'];
                message_element.html(errorMessage).show();
            });
        } else {
            ($('.message-error').offset() !== undefined)
                ? $('html,body').animate({scrollTop: $('.message-error').offset().top}, 'slow')
                : $('html,body').animate({scrollTop: $('#primary').offset().top}, 'slow');
        }
    }
}
