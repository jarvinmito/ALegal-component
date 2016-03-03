var aboitizApp = (function(){

	var initDonut = function(elem){
		// Interpret value as %
		var value = elem.find('h1').html();
		var circle = elem.find('.circle_animation');
		var getPercentage = Math.abs(((value / 100) * 440) - 440);
		// subtract 440 to reverse the effect
		// 440 = 0% and 0 = 100% in the stroke-dashoffset of svg in css

		circle.animate({'stroke-dashoffset' : getPercentage}, 1000);
	};
	
	var initListing = function(elem){
		// Select2 is present
		if( elem.length ){
			var selection = elem.select2({
					placeholder : 'Select ' + elem.data('title')
				});

			selection.on('change', function(){
				var html = "";
				var values = selection.val();

				for(var key in values){
					// console.log( key, values, values[key]);
					html += '<li class="abcom-list__item" data-index="'+key+'" data-value="'+values[key]+'">'+values[key]+'<a href="javascript:;" class="abcom-list__item__link"><i class="fa fa-close"></i></a></li>';
				}
				$('.abcom-list[data-parent="'+elem.attr('id')+'"]').html(html);

				$('.abcom-list__item__link').unbind('click');
				$('.abcom-list__item__link').click(function(e){
					var thisList = $(this).parent('.abcom-list__item');
					var index = thisList.data('index');

					// Remove from selection -- Array
					var newValue = selection.val();
					newValue.splice(index, 1);

					thisList.remove();

					selection.val(newValue);
					selection.trigger('change');
				});
			});
		}
	};

	var initModule = function(){
		console.log('Aboitiz Yeah!');
	};

	return {
		initModule : initModule,
		initDonut : initDonut,
		initListing : initListing
	}

}());