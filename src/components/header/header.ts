import { Component, Input } from '@angular/core';
import { Parameters, Phone } from '../../interfaces/parameters';
import { AppService } from '../../services/app.service';

@Component({
  selector: 'imobzi-header',
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class HeaderComponent {

  @Input() parameters: Parameters;
  @Input() calledFromHome: boolean;

  public logo: String  = null;
  public bucketPath: string = this._app.clientBucketPath();
  public layoutBucketPath: string = this._app.layoutBucketPath();

  constructor(
    private _app: AppService
  ) { }

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
