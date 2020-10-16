import { Component, Input } from '@angular/core';
import { Parameters, Phone, SocialNetwork } from '../../../interfaces/parameters';
import { AppService } from '../../../services/app.service';

@Component({
    selector: 'imobzi-redes-sociais',
    template: `
    <ng-container *ngIf="parameters.social_networks && parameters.social_networks.length > 0">
        <p class="titulo">Siga-nos nas Redes Sociais<p>
        <ul class="social-list__items inline-list list-right">
            <li *ngFor="let socialNetwork of parameters.social_networks" class="custom-rede-social">
                <a [href]="getSocialNetworkUrl(socialNetwork)" target="_blank" title="{{ socialNetwork.name }}" class="img-rede-social">
                    <img src="{{ imgSocial }}" class="social-img" alt="{{ socialNetwork.name }}"/>
                </a>
            </li>
            <ng-container *ngIf="parameters.phone && parameters.phone.length > 0">
                <li *ngFor="let phone of parameters.phone.slice(1, 2)" class="custom-rede-social">
                    <a *ngIf="phone.type && phone.type.toLowerCase() == 'whatsapp'"
                        [title]="phone.type + ': ' + phone.number" (click)="onPhoneClicked(phone)" class="img-rede-social">
                        <img src="{{ whatsapp }}" class="social-img"/>
                    </a>
                </li>
            </ng-container>
        </ul>
    </ng-container>
    `,
    styleUrls: ['redes-sociais.scss']
})
export class RedesSociaisComponent {

    @Input() parameters: Parameters;
    public layoutBucketPath = `${this._app.layoutBucketPath()}/image/redes-sociais`;

    public imgSocial: string;
    public layout_black = true;
    public icon: string;
    public whatsapp: string;

    constructor(private _app: AppService) { }

    getSocialNetworkUrl(socialNetwork: SocialNetwork) {
        (this.layout_black)
            ? this.icon = '_gray.svg'
            : this.icon = '.svg';

        const validUrl: RegExp = /((https?|http?):\/\/)/;
        let url: string;

        this.whatsapp = `${this.layoutBucketPath}/whatsapp${this.icon}`;

        if (validUrl.test(socialNetwork.account)) {
            switch (socialNetwork.name) {
                case 'Facebook':
                    this.imgSocial = `${this.layoutBucketPath}/facebook${this.icon}`;
                    break;

                case 'Instagram':
                    this.imgSocial = `${this.layoutBucketPath}/instagram${this.icon}`;
                    break;

                case 'LinkedIn':
                    this.imgSocial = `${this.layoutBucketPath}/linkedin${this.icon}`;
                    break;

                case 'Youtube':
                    this.imgSocial = `${this.layoutBucketPath}/youtube${this.icon}`;
                    break;

                case 'Twitter':
                    this.imgSocial = `${this.layoutBucketPath}/twitter${this.icon}`;
                    break;

                case 'Pinterest':
                    this.imgSocial = `${this.layoutBucketPath}/pinterest${this.icon}`;
                    break;

                case 'Skype':
                    this.imgSocial = `${this.layoutBucketPath}/skype${this.icon}`;
                    break;
            }
            return socialNetwork.account;
        } else {
            switch (socialNetwork.name) {
                case 'Facebook':
                    url = 'https://facebook.com/' + socialNetwork.account;
                    this.imgSocial = `${this.layoutBucketPath}/facebook${this.icon}`;
                    break;

                case 'Instagram':
                    url = 'https://instagram.com/' + socialNetwork.account;
                    this.imgSocial = `${this.layoutBucketPath}/instagram${this.icon}`;
                    break;

                case 'LinkedIn':
                    url = 'https://br.linkedin.com/' + socialNetwork.account;
                    this.imgSocial = `${this.layoutBucketPath}/linkedin${this.icon}`;
                    break;

                case 'Youtube':
                    url = 'https://youtube.com/' + socialNetwork.account;
                    this.imgSocial = `${this.layoutBucketPath}/youtube${this.icon}`;
                    break;

                case 'Twitter':
                    url = 'https://twitter.com/' + socialNetwork.account;
                    this.imgSocial = `${this.layoutBucketPath}/twitter${this.icon}`;
                    break;

                case 'Pinterest':
                    url = 'https://br.pinterest.com/' + socialNetwork.account;
                    this.imgSocial = `${this.layoutBucketPath}/pinterest${this.icon}`;
                    break;

                case 'Skype':
                    url = 'https://skype.com/pt-br/' + socialNetwork.account;
                    this.imgSocial = `${this.layoutBucketPath}/skype${this.icon}`;
                    break;
            }
        }
        return url;
    }

    onPhoneClicked(phone: Phone) {
        if (phone.type && phone.type.toLowerCase() === 'whatsapp') {
            window.open(`https://wa.me/${this.formatWhatsAppPhone(phone.number)}`);
        }
    }

    private formatWhatsAppPhone(phoneNumber: string) {
        if (phoneNumber.indexOf('+55') === -1) {
            phoneNumber = `+55${phoneNumber}`;
        }
        return phoneNumber.replace(/[^\d]/g, '');
    }
}


