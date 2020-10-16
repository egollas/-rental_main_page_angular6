import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { NewsletterForm } from '../../interfaces/newsletter';
import { SocialNetwork } from '../../interfaces/parameters';
import { FormService } from '../../services/form.service';
import { ParametersService } from '../../services/parameters.service';

declare var $: any;

@Component({
    selector: 'imobzi-newsletter',
    templateUrl: './newsletter.html',
    styleUrls: ['./newsletter.scss']
})
export class NewsletterComponent implements OnInit {

    @ViewChild('newsletter') form;
    socialNetworks: Array<SocialNetwork>;
    model = new NewsletterForm('', '');
    public displaySuccess = false;
    public displayFailure = false;

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private _parameters: ParametersService,
        private _formService: FormService
    ) {}

    ngOnInit() {
        this._parameters.getParameters().subscribe(response => {
            this.socialNetworks = response.social_networks;
        });

        if (isPlatformBrowser(this.platformId)) {
            if (($(window).width() > 768) && ($(window).height() > 654)) {
                $(window).scroll(function() {
                    const widgetAreaHeight = $('#newsletter-window').height();
                    const widgetHeight = $('#newsletterForm').height();
                    const scrolledFromtop = $(window).scrollTop();
                    const startFix = 257 - 115;
                    const stopFix = widgetAreaHeight - widgetHeight + startFix - 90;
                    if (scrolledFromtop > stopFix) {
                        $('#newsletterForm').removeClass('scrolled');
                        $('#newsletterForm').addClass('scrolledToTheBottom');
                    } else if ((scrolledFromtop > startFix) && (scrolledFromtop < stopFix)) {
                        $('#newsletterForm').addClass('scrolled');
                        $('#newsletterForm').removeClass('scrolledToTheBottom');
                    } else {
                        $('#newsletterForm').removeClass('scrolled');
                        $('#newsletterForm').removeClass('scrolledToTheBottom');
                    }
                });
            }
        }
    }

    public submit(): void {
        if (this.form.valid) {
            this.form.reset();
            this.displaySuccess = true;
            this.displayFailure = false;
        } else {
            this.displaySuccess = false;
            this.displayFailure = true;
        }
    }
}
