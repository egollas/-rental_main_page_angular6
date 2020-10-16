import { Component, Input } from '@angular/core';
import { Parameters, Phone } from '../../interfaces/parameters';

@Component({
  selector: 'whatsapp-button',
  template: `
    <div *ngIf="parameters && parameters.phone?.length > 0">
      <div *ngFor="let phone of parameters.phone.slice(0, 3)">
        <div *ngIf="phone.type && phone.type.toLowerCase() == 'whatsapp'">
          <div class="whatsapp-button-position">
            <a
              class="whatsapp-numero"
              href="javascript:void(0)"
              (click)="onPhoneClicked(phone)"
              [title]="phone.number">
              <div class="whatsapp-button">
                <img
                  src="https://imobzi.storage.googleapis.com/image/whatsapp.svg"
                />
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['whatsapp-button.scss']
})
export class WhatsappButtonComponent {

  @Input() parameters: Parameters;

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
