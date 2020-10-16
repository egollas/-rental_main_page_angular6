import { Component, Input } from '@angular/core';

@Component({
  selector: 'imobzi-breadcrumb',
  templateUrl: './breadcrumb.html',
  styleUrls: ['./breadcrumb.scss']
})
export class BreadcrumbComponent {

    @Input() pageTitle?: string = null;
    @Input() category?: string = null;
}
