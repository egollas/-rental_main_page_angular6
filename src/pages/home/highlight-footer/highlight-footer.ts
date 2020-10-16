import { Component, Input, OnInit } from '@angular/core';
import { Property } from '../../../interfaces/property';

@Component({
    selector: 'properties-highlight-footer',
    templateUrl: './highlight-footer.html',
    styleUrls: ['./highlight-footer.scss']
})
export class PropertyHighlightFooterComponent implements OnInit {

    @Input() properties: Array<Property>;

    ngOnInit() {
        if (this.properties) {
            this.properties = this.properties.slice(0, 4);
        }
    }

    public translateFinality(finality: string) {
        switch (finality) {
            case 'residential':
                return 'Residencial';
            case 'commercial':
                return 'Comercial';
            case 'Rural':
            case 'rural':
                return 'Rural';
            default:
                return finality;
        }
    }

}
