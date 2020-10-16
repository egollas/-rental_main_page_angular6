import { Component, OnInit } from '@angular/core';
import { AppService } from '../../services/app.service';

@Component({
  selector: 'app-site-suspended',
  templateUrl: './suspended.html',
  styleUrls: ['./suspended.scss']
})
export class SuspendedComponent implements OnInit {

  public layoutBucket: string;

  constructor(
    private _app: AppService
  ) { }

  ngOnInit() {
    this.layoutBucket = this._app.layoutBucketPath();
  }
}
