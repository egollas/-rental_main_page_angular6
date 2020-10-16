import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Content } from '../../interfaces/content';
import { ContentService } from '../../services/content.service';

@Component({
    selector: 'imobzi-content',
    templateUrl: './content.html',
    styleUrls: ['./content.scss']
})

export class ContentPage implements OnInit {
    public content: Content;
    public key: string;

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private _contentService: ContentService,
        private route: Router,
        private title: Title,
        private meta: Meta,
        private activeRoute: ActivatedRoute
    ) { }

    ngOnInit() {
        this.key = this.activeRoute.snapshot.paramMap.get('id');
        if (this.key) {
            this._contentService.getSitePreviewData(this.key).subscribe(
                response => this.content = response,
                () => this.route.navigate(['pagina-nao-encontrada'])
            );
        } else if (isPlatformBrowser(this.platformId)) {
            document.getElementsByTagName('body')[0].className = '';
            document.getElementsByTagName('body')[0].classList.add(
                'page',
                'position-one-left-sidebar',
                'sidebar-1-4',
                'tm_pb_builder'
            );
            this._contentService.getContent(location.pathname.slice(1)).subscribe(content => {
                this.content = content;
                this.title.setTitle(content.title + ' | ' + this.title.getTitle());
                this.meta.updateTag({ name: 'description', content: content.meta_description});
            },
                () => this.route.navigate(['pagina-nao-encontrada']));
        }
    }
}
