import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'objectgroups', pure: false })
export class FieldGroupsPipe implements PipeTransform {
    transform(value: any): Array<String> {
        const fieldGroups: Array<String> = [];
        // tslint:disable-next-line:forin
        for (const key in value) {
            fieldGroups.push(key);
        }
        return fieldGroups;
    }
}
