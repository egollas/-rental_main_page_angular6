import { Component, Input } from '@angular/core';
import { Property } from '../../../interfaces/property';

@Component({
    selector: 'properties-highlight',
    templateUrl: './highlight.html',
    styleUrls: ['./highlight.scss']
})
export class PropertyHighlightsComponent {

    @Input() properties: Array<Property>;

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
