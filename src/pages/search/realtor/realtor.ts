import { Component, OnInit, Input } from '@angular/core';
import { RealtorsService } from '../../../services/realtor.service';
import { Realtor } from '../../../interfaces/realtor';
import { Title } from '@angular/platform-browser';
import { AppService } from '../../../services/app.service';

@Component({
    selector: 'search-realtor',
    templateUrl: './realtor.html',
    styleUrls: ['./realtor.scss']
})
export class SearchRealtorComponent implements OnInit {

    @Input() realtorId: string;
    public realtor: Realtor;
    constructor(
        private _app: AppService,
        private title: Title,
        private _realtor: RealtorsService
    ) {}

    ngOnInit() {
        this._realtor.getRealtor(this.realtorId).subscribe(
            realtor => {
                this.realtor = realtor;
                this.title.setTitle(`Imóveis do corretor ${this.realtor.name} | ` + this.title.getTitle());
            });
    }

    realtorImgErrorHandler(event) {
        event.target.onerror = null;
        event.target.src = `${this._app.layoutBucketPath()}/image/realtor-image.jpg`;
    }
}
