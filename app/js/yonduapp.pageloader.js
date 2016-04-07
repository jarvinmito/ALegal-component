App.Pageloader = (function(){
	
	var configMap = {},
		jqueryMap = {
			$main : $('.ab-wrapper'),
			$header : $('header.header'),
			$body : $('.main-content__main'),
			$footer : $('footer.footer')
		};

	var initClipboard = function(){

		var snippets = $('.yondu__code');

		snippets.each(function(snippet) {
		    $(this).prepend('<button class="btn btn-danger yondu__code__btn" data-clipboard-snippet data-toggle="tooltip" data-placement="bottom" title="Copy this code" ><i class="fa fa-clipboard"></i></button>');
		});
		//

		var clipboardSnippets = new Clipboard('[data-clipboard-snippet]', {
		    target: function(trigger) {
		        return trigger.nextElementSibling;
		    }
		});

		var showTooltip = function(elem, msg) {
		    // elem.setAttribute('class', 'btn btn-danger yondu__code__btn');
		    // elem.setAttribute('title', msg);
		//    $('.tooltip-inner').html(msg);
			// var notif = $('<div class="yondu__code__notif" />');
			// $(elem).parent().append(notif);

			$('<div class="yondu__code__notif" />')
			.appendTo($(elem).parent())
			.html(msg)
			.fadeIn(250, function(){
				$(this).delay(750).fadeOut(250, function(){
					$(this).remove();
				});
			});
		}


		clipboardSnippets.on('success', function(e) {
		    e.clearSelection();

		    showTooltip(e.trigger, 'Copied!');
		});

		clipboardSnippets.on('error', function(e) {
		    // showTooltip(e.trigger, fallbackMessage(e.action));
		    console.log(e.trigger, e.action);
		});
		// clipboardSnippets.destroy();
	};

	var initDataTables = function(){
		// Instantiate Data Tables if an Aboitiz Table Component exists
		if( $('.abcom-table').length ){
			$('#table_id').DataTable();

			$('#table_id3').DataTable({
				searching : false,
		      	lengthChange : false,
				info : false
			})

			$('#table_id2').DataTable({
		      searching : false,
		      paging : false,
		      lengthChange : false,
		      info : false
		    });
		}
	};

	var bind = function(){
		if( $('.yondu__navlist').length ){
			$('.yondu__navlist').unbind('click');
			$('.yondu__navlist').click(function(){
				var anchor = $(this);
				var pos = $(anchor.data('href')).offset().top;

				$('.yondu__navlist').not(anchor).removeClass('active');
				anchor.addClass('active');

				$('html, body').animate({
					scrollTop : pos - 10
				}, 500);
			});
		}

		// Whenever listing is present in the DOM
		if( $('.abcom-list__item__link').length ){
			$('.abcom-list__item__link').unbind('click');
			$('.abcom-list__item__link').click(function(){
				$(this).parent('.abcom-list__item').remove();
			});
		}

		
	};

	// var initSelect2 = function(){
	// 	// Select2 is present
	// 	var selectid = $('#select2');
	// 	if( selectid.length ){
	// 		var selection = selectid.select2({
	// 				placeholder : 'Select ' + selectid.data('title')
	// 			});

	// 		selection.on('change', function(){
	// 			console.log($(this).val());
	// 		});
	// 	}
	// };

	// var initDonut = function(elem){
	// 	// Interpret value as %
	// 	var value = elem.find('h1').html();
	// 	var circle = elem.find('.circle_animation');
	// 	var getPercentage = Math.abs(((value / 100) * 440) - 440);
	// 	// subtract 440 to reverse the effect
	// 	// 440 = 0% and 0 = 100% in the stroke-dashoffset of svg in css

	// 	circle.animate({'stroke-dashoffset' : getPercentage}, 1000);
	// };
		
	// Page Loaders
	var home = function(){
		jqueryMap.$body.html(App.Templates['yhome']());
		initClipboard();
	};

	var templates = function(){
		jqueryMap.$body.html(App.Templates['ytemplates']());
		initClipboard();
	};

	var reusables = function(){
		jqueryMap.$body.html(App.Templates['yreusables']());
		initClipboard();
		initDataTables();

		aboitizApp.initDonut();
		aboitizApp.initListing();
		aboitizApp.initFileReader();
		aboitizApp.initDateTimePicker();
		aboitizApp.initDTpicker();
		aboitizApp.initFilter();
		aboitizApp.initProgressBar();
		aboitizApp.initColorPicker();
		aboitizApp.initModals();
		aboitizApp.initMoMListing();
		aboitizApp.initMembers();

		bind();
	};

	var specifics = function(){
		jqueryMap.$body.html(App.Templates['yspecifics']());
		initClipboard();
		initDataTables();

		aboitizApp.initDonut();
		aboitizApp.initFileReader();
		aboitizApp.initListing();
		aboitizApp.initDateTimePicker();
		aboitizApp.initDTpicker();
		aboitizApp.initFilter();
		aboitizApp.initDataTables();
		aboitizApp.initMovables();
		aboitizApp.initProgressBar();
		aboitizApp.initColorPicker();
		aboitizApp.initModals();
		aboitizApp.initMoMListing();
		aboitizApp.initMembers();

		bind();
	};

	var error = function(){
		jqueryMap.$body.html(App.Templates['y404']());
	};


	return {
		error : error,
		home : home,
		templates : templates,
		reusables : reusables,
		specifics : specifics
	};

}());