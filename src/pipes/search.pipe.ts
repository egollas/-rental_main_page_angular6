import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'searchAreaItems', pure: false })
export class SearchAreaPipe implements PipeTransform {
    transform(value: any): Array<String> {
        return value.replace('_to_', ' a ');
    }
}
