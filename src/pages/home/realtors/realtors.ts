import { Component, OnInit } from '@angular/core';
import { Realtor } from '../../../interfaces/realtor';
import { AppService } from '../../../services/app.service';
import { RealtorsService } from '../../../services/realtor.service';

@Component({
    selector: 'imobzi-realtors',
    templateUrl: './realtors.html',
    styleUrls: ['./realtors.scss']
})

export class RealtorsComponent implements OnInit {

    public realtors: Array<Realtor>;
    public realtorDefaultPhotoUrl = `${this._app.layoutBucketPath()}/image/realtor-image.jpg`;

    constructor(
        private _app: AppService,
        private _realtors: RealtorsService
    ) { }

    ngOnInit() {
        this._realtors.getRealtors().subscribe(realtors => this.realtors = realtors);
    }

    realtorsSearch() {
        localStorage.removeItem('search_params');
  }

    realtorImgErrorHandler(event) {
        event.target.onerror = null;
        event.target.src = this.realtorDefaultPhotoUrl;
    }

}
