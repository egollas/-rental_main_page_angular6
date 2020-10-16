import { NgModule } from '@angular/core';
import { SanitizedHtmlPipe } from './sanitized-html';

@NgModule({
    declarations: [ SanitizedHtmlPipe ],
    exports: [ SanitizedHtmlPipe ]
})

export class SanitizedHtmlPipeModule { }
