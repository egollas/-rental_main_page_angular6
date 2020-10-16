import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { Parameters, SocialNetwork, Phone } from '../../interfaces/parameters';
import { AppService } from '../../services/app.service';

declare var $: any;
declare var jQuery: any;

@Component({
    selector: 'imobzi-footer',
    templateUrl: 'footer.html',
    styleUrls: ['footer.scss']
})
export class FooterComponent implements OnInit {

    @Input() parameters: Parameters;
    public socialNetworks: Array<SocialNetwork>;

    public bucketPath: string = this._app.clientBucketPath();
    public layoutBucketPath: string = this._app.layoutBucketPath();

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private _app: AppService
    ) { }

    ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
            if ($.isFunction(jQuery.fn.UItoTop)) {
                $().UItoTop({
                    text: 'Top',
                    scrollSpeed: 600
                });
            }
        }
    }

    onPhoneClicked(phone: Phone) {
        if (phone.type && phone.type.toLowerCase() === 'whatsapp') {
            window.open(`https://wa.me/${this.formatWhatsAppPhone(phone.number)}`);
        } else {
            window.open(`tel:${phone.number}`);
        }
    }

    private formatWhatsAppPhone(phoneNumber: string) {
        if (phoneNumber.indexOf('+55') === -1) {
            phoneNumber = `+55${phoneNumber}`;
        }
        return phoneNumber.replace(/[^\d]/g, '');
    }
}
