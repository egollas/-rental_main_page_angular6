import { Component, AfterViewInit } from '@angular/core';

@Component({
    selector: 'add-this-share',
    template: `
        <div class="addthis_inline_share_toolbox_as3m"></div>
    `,
    styleUrls: ['add-this.scss']
})
export class AddThisComponent implements AfterViewInit {

    ngAfterViewInit() {
        if (window['addthis']) {
            window['addthis'].layers.refresh();
        } else {
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = '//s7.addthis.com/js/300/addthis_widget.js#pubid=ra-5714f39f3e061698';
            document.getElementsByTagName('head')[0].appendChild(script);
        }
    }
}
