import { isPlatformBrowser } from '@angular/common';
import { Component, ContentChild, ElementRef, EventEmitter, Inject, Input, OnDestroy, OnInit, Output, PLATFORM_ID, Renderer2, TemplateRef } from '@angular/core';

@Component({
    selector: 'lazy-loading-image',
    template: `
    <ng-container *ngIf="inView" [ngTemplateOutlet]="template">
    </ng-container>
  `,
    styles: [':host {display: block;}']
})

export class LazyLoadingImage implements OnInit, OnDestroy {
    observer: IntersectionObserver;
    inView = false;
    once50PctVisible = false;

    @ContentChild(TemplateRef) template: TemplateRef<any>;
    @Input() options: any = { threshold: [.1, .2, .3, .4, .5, .6, .7, .8] };
    // tslint:disable-next-line:no-output-rename
    @Output('inView') inView$: EventEmitter<any> = new EventEmitter();
    // tslint:disable-next-line:no-output-rename
    @Output('notInView') notInView$: EventEmitter<any> = new EventEmitter();

    constructor(
        public element: ElementRef,
        public renderer: Renderer2,
        @Inject(PLATFORM_ID) private platformId: any) { }

    ngOnInit(): void {
        if (isPlatformBrowser(this.platformId)) {
            this.observer = new IntersectionObserver(this.handleIntersect.bind(this), this.options);
            this.observer.observe(this.element.nativeElement);
        }
    }

    ngOnDestroy(): void {
        this.observer.disconnect();
    }

    handleIntersect(entries, observer): void {
        entries.forEach((entry: IntersectionObserverEntry) => {
            if (entry.isIntersecting) {
                this.inView = true;
                this.inView$.emit(entry);
            } else {
                this.notInView$.emit(entry);
            }
        });
    }
}
