import { Component, OnInit } from '@angular/core';
import { PropertyService } from '../../../services/property.service';
import { PropertyTypeHighlight } from '../../../interfaces/typehighlight';
import { AppService } from '../../../services/app.service';

@Component({
  selector: 'imobzi-typespotlight',
  templateUrl: './typespotlight.html',
  styleUrls: ['./typespotlight.scss']
})
export class TypeSpotlightComponent implements OnInit {

  public layoutBucketPath: string = this._app.layoutBucketPath();
  public typeSpotlights: PropertyTypeHighlight[];
  constructor(
    private _propertyService: PropertyService,
    private _app: AppService
  ) { }


  ngOnInit() {
    this._propertyService.getTypeHighlights().subscribe(typespotlights => this.typeSpotlights = typespotlights.slice(0, 8));
  }

  typeSearch() {
    localStorage.removeItem('search_params');
  }

}
