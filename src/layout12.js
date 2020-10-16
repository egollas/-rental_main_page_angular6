(function($) {
	'use strict';
	var $window = $(window);
	var $document = $(document);
	var layout12 = {

		init: function(){

			var self = this;

			$document.on('ready', function(){
				self.document_ready_render(self);
			});

			self.window_load_render(self);

		},

		document_ready_render: function(self){
			var self = self;
			self.to_top_init(self);
			self.real_estate_scripts( self );
		},

		window_load_render: function(self){
			self.page_preloader_init();
		},

		page_preloader_init: function(){
			var carregando = $('#carregando');
			if(carregando[0]){
				carregando.delay(500).fadeTo(500, 0, function(){
					carregando.hide();
					carregando.css({
						background: 'none',
						opacity: 1
					});
				});
			}
		},

		to_top_init: function(self){
			if($.isFunction(jQuery.fn.UItoTop)){
				$().UItoTop({
					text: "Top",
					scrollSpeed: 600
				});
			}
		},

		/* It's for the filter */
		real_estate_scripts: function(self){

			/* Search Result: Sort By */
			var propertiesSort = $('#ordenar');
			// Styling form
			if(propertiesSort.length > 0)
				propertiesSort.styler();


			if($( '.widget-tm-re-search__form' ).length > 0){

				var searchForm 			   = $('.widget-tm-re-search__form'),
					  numberInputs 		   = $('.tm-re-search-form__range input'),
					  selects 			     = $('.tm-re-search-form__group select'),
					  fullAreaSearchForm = $('.full-width-header-area .widget-tm-re-search');

				// Number inputs validate
				numberInputs.each(function(){
					$(this).keydown(function(event){
						if ( event.keyCode !== 8 && event.keyCode !== 9 && event.keyCode !== 13 && event.keyCode !== 46 ) {
							if ( ( event.keyCode < 48 || event.keyCode > 57 ) && ( event.keyCode < 96 || event.keyCode > 105 ) ) {
								event.preventDefault();
							}
						}
					});
				});

				// Styling form
				searchForm.each(function(){

					// Styling form selects
					selects.styler();

					// Styling form number inputs
					numberInputs.styler();

				});

				// Toggle min/max forms & sync form values
				fullAreaSearchForm.each(function(){

					var thisWidget 	 = $(this),
						  mainForm 		 = $('.widget-tm-re-search__form-main', thisWidget),
						  advancedForm = $('.widget-tm-re-search__form-advanced', thisWidget),
						  // openButton 	 = $('.tm-re-search-form__toggle-forms__open', thisWidget),
						  closeButton  = $('.tm-re-search-form__toggle-forms__close', thisWidget),

							// Forms sync elements
							keywordMainInput 		= $('.tm-re-search-form__field[name="s"]', mainForm),

								// Styled elements
								statusMainStyledSelect 		  = $('select[name="property_status"] ~ .jq-selectbox__dropdown', mainForm).find('ul'),
								statusMainStyledPlaceholder = $('select[name="property_status"] ~ .jq-selectbox__select', mainForm).find('.jq-selectbox__select-text'),
								typeMainStyledSelect   		  = $('select[name="property_type"] ~ .jq-selectbox__dropdown', mainForm).find('ul'),
								typeMainStyledPlaceholder	  = $('select[name="property_type"] ~ .jq-selectbox__select', mainForm).find('.jq-selectbox__select-text'),

						// Advanced form sync elements
						keywordAdvancedInput 	= $('.tm-re-search-form__field[name="s"]', advancedForm),

							// Styled elements
							statusAdvancedStyledSelect	    = $('select[name="property_status"] ~ .jq-selectbox__dropdown', advancedForm).find('ul'),
							statusAdvancedStyledPlaceholder = $('select[name="property_status"] ~ .jq-selectbox__select', advancedForm).find('.jq-selectbox__select-text'),
							typeAdvancedStyledSelect  	    = $('select[name="property_type"] ~ .jq-selectbox__dropdown', advancedForm).find('ul'),
							typeAdvancedStyledPlaceholder   = $('select[name="property_type"] ~ .jq-selectbox__select', advancedForm).find('.jq-selectbox__select-text'),

						// Main Values
						keywordMainInputVal,

							// Styled
							statusMainStyledSelectIndex,
							typeMainStyledSelectIndex,

						// Advanced Values
						keywordAdvancedInputVal,

							// Styled
							statusAdvancedStyledSelectIndex,
							typeAdvancedStyledSelectIndex;

					closeButton.click(function(event){

						event.preventDefault();

						// Default values
						keywordAdvancedInputVal = keywordAdvancedInput.val();

						// Styled values
						statusAdvancedStyledSelectIndex = statusAdvancedStyledSelect.find( 'li.sel' ).index();
						typeAdvancedStyledSelectIndex	= typeAdvancedStyledSelect.find( 'li.sel' ).index();

						if(thisWidget.hasClass('toggled')){

							// Default values
							keywordMainInput.val(keywordAdvancedInputVal);

							// Styled values
							statusMainStyledSelect.find('li').removeClass('selected sel').eq(statusAdvancedStyledSelectIndex).addClass('selected sel');
							statusMainStyledPlaceholder.text(statusAdvancedStyledPlaceholder.text());

							typeMainStyledSelect.find('li').removeClass('selected sel').eq(typeAdvancedStyledSelectIndex).addClass('selected sel');
							typeMainStyledPlaceholder.text(typeAdvancedStyledPlaceholder.text());

							thisWidget.removeClass('toggled');

						}

					});

				});

				$('html').on('click', function(e){
					if(!$(e.target).closest('.widget-tm-re-search.toggled').length)
						$('.widget-tm-re-search.toggled').removeClass('toggled');
				});

			}
		},

	}

	layout12.init();

}(jQuery));

/**
 * Autocomplete Widget used on the simple search form for the City field.
 */
$.widget('custom.catcomplete', $.ui.autocomplete, {
	_create: function(){
		this._super();
		this.widget().menu('option', 'items', '> :not(.ui-autocomplete-category)');
	},
	_renderMenu: function(ul, items){
		var that = this,
		currentCategory = '';
		$.each(items, function(index, item){
			var li;
			if(item.category != currentCategory){
				ul.append('<li class=\'ui-autocomplete-category\'>' + item.category + '</li>');
				currentCategory = item.category;
			}
			li = that._renderItemData(ul, item);
		});
	}
});

/**
 * Script to set up the functionality of changing the layout of the properties'
 * listing.
 */
function propertiesListLayoutOptions(){

	var buttons = $('.tm-re-switch-layout__btn');

	if(buttons.length > 0){

		buttons.on('click', function(e){

			var items = $('#visualizar_lista');

			var target      = $(e.target),
					form        = target.parents('form'),
					// layout      = target.val(),
					active      = 'tm-re-switch-layout__btn--active',
					listClass   = 'grid list',
					processing  = 'processing';

			if(target.hasClass( active ))
				return false;

			if(form.hasClass(processing))
				return false;

			form.addClass(processing);
			items.addClass(processing);

			if(buttons.hasClass(active))
				buttons.removeClass(active);

			target.addClass(active);

			form.removeClass( processing );
			items.removeClass( processing );
			items.toggleClass( listClass );

		});

	}

}

function detalhesGaleria(){

	var gallery = $('#detalhes-gallery');
	var galleryThumbs = $('#detalhes-gallery-thumbs');
	var swiperSlidesPerView = parseInt(gallery.data('swiper-slides-per-view'));

	if( ! $.isFunction( jQuery.fn.swiper ) || ! gallery.length )
		return false;

	var swiperInstances = [];

	swiperInstances[0] = gallery.swiper({
		nextButton:".tm-property-gallery__button-next",
		prevButton:".tm-property-gallery__button-prev",
		paginationClickable:true,
		autoHeight:false,
		loop:true,
		loopedSlides:fotosTotal,
		grabCursor:true,
		speed:600,
		effect:"slide",
		group:{
			top:".tm-property-gallery--top",
			thumbs:".tm-property-gallery--thumbs"
		},
		spaceBetween:4
	});

	swiperInstances[1] = galleryThumbs.swiper({
		spaceBetween:4,
		slidesPerView:'auto',
		slideToClickedSlide:true,
		loop:true,
		speed:600,
		loopedSlides:fotosTotal,
		centeredSlides:true,
		group:{
			top:".tm-property-gallery--top",
			thumbs:".tm-property-gallery--thumbs"
		}
	});

	swiperInstances[0].params.control = swiperInstances[1];
	swiperInstances[1].params.control = swiperInstances[0];

}

function imgErrorHandler(img){
	img.onerror = null;
	// Imagem temporaria na tarefa se inserir as imagens padrões no storage atualizar com a imagem padrão de foto não encontrada
	img.src = 'https://imobzi.storage.googleapis.com/image/image-not-found.png';
}

function popupscroll(url, largura, altura){
	var nWind;
	nWind = window.open(url, '_blank',
	'toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=no, width='+largura+',height='+altura);
}
