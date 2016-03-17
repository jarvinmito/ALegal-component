var aboitizApp = (function(){

	var initFilter = function(){
		var filter = $('.abcom-filter');
		if( filter.length ){
			filter.each(function(){
				var sfilter = $(this);
				var cat = sfilter.find('.abcom-filter__category');
				var entries = sfilter.find('.abcom-filter__entries');
				// var clear = sfilter.find('.abcom-filter__btn--clear');
				// var search = sfilter.find('.abcom-filter__btn--search');

				sfilter.find('.abcom-filter__type').hide();

				var clearform = function(){
					sfilter.find('select, input').not('.abcom-filter__category, .abcom-filter__entries').val('');
				};

				cat.on('change', function(e){
					var selected = $(this).val();
					// Reset all values
					clearform();
					sfilter.find('.abcom-filter__type').not('.abcom-filter__type[data-filter-type="'+selected+'"]').hide();
					sfilter.find('.abcom-filter__type[data-filter-type="'+selected+'"]').show();
					// console.log(sfilter.find('.abcom-filter__type[data-filter-type="'+selected+'"]'));
				});

				entries.on('change', function(e){
					var selected = $(this).val();

					if( $(this).data('target') ){
						var target = $(this).data('target');
						var actual_target = $(target).parents('.dataTables_wrapper').find('.dataTables_length select');

						actual_target.val(selected);
						actual_target.trigger('change');
					}

				});

				// clear.on('click', function(e){
				// 	clearform();
				// });

			});
		}
	};

	var initDonut = function(){
		// Interpret value as %
		var elem = $('.abcom-donut');

		if( elem.length ){

			elem.each(function( index ){
				var value = $(this).find('h1').html();
				var circle = $(this).find('.circle_animation');
				var getPercentage = Math.abs(((value / 100) * 440) - 440);
				// subtract 440 to reverse the effect
				// 440 = 0% and 0 = 100% in the stroke-dashoffset of svg in css

				circle.animate({'stroke-dashoffset' : getPercentage}, 1000);
			});
		}
	};
	
	var initListing = function(){
		// Select2 is present
		var elem = $('div.abcom-list');
		var renderList = function(elem){
			var html = "";
			var currSel = elem;
			var values = currSel.val();

			for(var key in values){
				// console.log( key, values, values[key]);
				html += '<li class="abcom-list__item" data-index="'+key+'" data-value="'+values[key]+'">'+values[key]+'<a href="javascript:;" class="abcom-list__item__link"><i class="fa fa-close"></i></a></li>';
			}

			var id = currSel.attr('id');
			var list = $('.abcom-list__items[data-parent="'+id+'"]');
			list.html(html);
			list.find('.abcom-list__item__link').unbind('click');
			list.find('.abcom-list__item__link').click(function(e){
				var thisList = $(this).parent('.abcom-list__item');
				var index = thisList.data('index');

				// Remove from selection -- Array
				var newValue = currSel.val();
				newValue.splice(index, 1);

				thisList.remove();

				currSel.val(newValue);
				currSel.trigger('change');
			});
		};

		if( elem.length ){
			elem.each(function(){
				var select = $(this).find('.abcom-list__dropdown');
				if( select.length ){
					var selection = $(this).find('.abcom-list__dropdown').select2({
							placeholder : 'Select ' + select.data('title')
						});
					var dateField = $(this).find('.abcom-list__date');
					var addButton = $(this).find('.abcom-list__add');
					var listItems = $(this).find('.abcom-list__items');

					renderList(select);
					selection.on('change', function(){ renderList(select); });
					addButton.click(function(){
						selection.select2('open');
					});

					if( dateField.length ){
						dateField.on('dp.change', function(){

							var dateSelected = $(this).val();
							var options = select[0].options;
							// console.log(.length);

							// Slightly Native
							for(var key in options){
								if( !options[key].selected ){
									options[key].value = dateSelected + ' ' + options[key].text;
								}
							}

							dateField.removeClass('has-error');

						});

						selection.on('select2:open', function(){
							if( !dateField.val() ){
								selection.select2('close');
								dateField.addClass('has-error');
							}
						});
					}
				}
			});
		}
	};

	// Used in form dates only
	var initDTpicker = function(){
		if( $('.abcom-form__date').length ){
			$('.abcom-form__date').each(function(){
				$(this).datetimepicker({
					format: 'MM/DD/YYYY'
				});	
			})
		}

		if( $('.abcom-form__daterange').length ){
			$('.abcom-form__daterange').each(function(){
				var currSet = $(this),
					currFrom = currSet.find('.abcom-form__daterange--from'),
					currTo = currSet.find('.abcom-form__daterange--to');

				currFrom.datetimepicker({ format: 'MM/DD/YYYY' });
				currFrom.on("dp.change", function (e) {
					currTo.data("DateTimePicker").minDate(e.date);
		        });

		        currTo.datetimepicker({ format: 'MM/DD/YYYY', useCurrent : false });
				currTo.on("dp.change", function (e) {
					currFrom.data("DateTimePicker").maxDate(e.date);
		        });
			});
		}
	};

	var initDateTimePicker = function(){
		var inputs = $('.abcom-filter__type--date');

		if( inputs.length ){

			inputs.each(function( index ){
				var currentSet = $(this);
				var dates = $(this).find('.abcom-filter__date');
				
				if( dates.length === 1 ){
					// single
					dates.datetimepicker({
						format: 'MM/DD/YYYY'
					});

				}else if( dates.length === 2){
					// daterange
					dates.each(function(){
						var current = $(this);

						if( current.is($('.abcom-filter__date[data-role="from"]')) ){
							var from = current;
							from.datetimepicker({
								format: 'MM/DD/YYYY'
							});
							from.on("dp.change", function (e) {
								currentSet.find('.abcom-filter__date[data-role="to"]').data("DateTimePicker").minDate(e.date);
					        });
						}else if( current.is($('.abcom-filter__date[data-role="to"]')) ){
							var to = current;
							to.datetimepicker({
								format: 'MM/DD/YYYY',
								useCurrent : false
							});
							to.on("dp.change", function (e) {
								currentSet.find('.abcom-filter__date[data-role="from"]').data("DateTimePicker").maxDate(e.date);
					        });
						}
					});
				}

			});
		}
	};


	var initFileReader = function(){
		var uploadForm = $('.abcom-upload');
		var allFiles = {};

		if( uploadForm.length ){
			uploadForm.each(function( index ){
				var upParent = $(this);
				var currIndex = index;
				allFiles[index] = [];
				
				upParent.find('.abcom-upload__file').fileReaderJS({
					readAsDefault: "DataURL",
					on: {
					    load: function(e, file) {
					      var data = { e : e, file : file};
					      if( extCheck(file) ){
					      	var arrIndex = allFiles[index].length;
					      	var params = {
						      		file : file,
						      		upParent : upParent,
						      		currIndex : currIndex
						      	}

					      	allFiles[index].push(data);
					      	renderList(params);
					      	bind(params);
					      }
					    }
					}
				});
			});
		}

		var exportFiles = function(){
			return allFiles;
		};

		var bind = function(params){
			var upParent = params.upParent;
			var file = params.file;
			var index = params.currIndex;

			upParent.find('.abcom-upload__removebtn').unbind('click');
			upParent.find('.abcom-upload__removebtn').click(function(e){
				console.log(allFiles[index]);
				e.preventDefault();
				var files = allFiles[index];
				// allFiles[index].splice(allFiles[index].indexOf(data), 1);

				for(var key in files){
					var filename = files[key].file.name;
					var parentItem = $(this).parents('.abcom-upload__list__item');
					var pairname = parentItem.data('filename');

					if( filename === pairname ){
						allFiles[index].splice(key, 1);
						parentItem.remove();
					}
				}
			});
		};

		var extCheck = function(filedata){
			var filename = filedata.name;
			var extension = filename.substr(filename.lastIndexOf('.') + 1, filename.length);
			var extensions = ['jpg','jpeg','gif','png','doc','docx','odt','txt','rtf','pdf','xls','xlsx','csv','ods','ppt','pptx','odp'];
			
			return (extensions.indexOf(extension) != -1) ? true : false;
		};

		var formatBytes = function(bytes,decimals) {
		   if(bytes == 0) return '0 Byte';
		   var k = 1000; // or 1024 for binary
		   var dm = decimals + 1 || 3;
		   var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
		   var i = Math.floor(Math.log(bytes) / Math.log(k));
		   return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
		};

		var renderList = function(params){
			var iconlist = {
				'img' : '<i class="fa fa-file-image-o"></i>',
				'doc' : '<i class="fa fa-file-word-o"></i>',
				'txt' : '<i class="fa fa-file-text-o"></i>',
				'pdf' : '<i class="fa fa-file-pdf-o"></i>',
				'xls' : '<i class="fa fa-file-excel-o"></i>',
				'ppt' : '<i class="fa fa-file-powerpoint-o"></i>'
			};

			var icons = {
				'jpg' : iconlist['img'],
				'jpeg' : iconlist['img'],
				'gif' : iconlist['img'],
				'png' : iconlist['img'],
				'png' : iconlist['img'],
				'doc' : iconlist['doc'],
				'docx' : iconlist['doc'],
				'odt' : iconlist['doc'],
				'txt' : iconlist['txt'],
				'rtf' : iconlist['txt'],
				'pdf' : iconlist['pdf'],
				'xls' : iconlist['xls'],
				'xlsx' : iconlist['xls'],
				'csv' : iconlist['xls'],
				'ods' : iconlist['xls'],
				'ppt' : iconlist['ppt'],
				'pptx' : iconlist['ppt'],
				'odp' : iconlist['ppt']
			};

			var filedata = params.file;
			var upParent = params.upParent;

			var filename = filedata.name;
			var size = filedata.size;
			var extension = filename.substr(filename.lastIndexOf('.') + 1, filename.length);

			var html = '<li class="abcom-upload__list__item container-fluid" data-filename="'+filename+'">' +
						'<div class="row">' +
							'<div class="col-sm-2"><span class="abcom-upload__file__icon">'+icons[extension]+'</span></div>' +
							'<div class="col-sm-4">'+filename+'</div>' +
							'<div class="col-sm-3">'+formatBytes(size)+'</div>' +
							'<div class="col-sm-3 abcom-container--right"><button class="btn abcom-btn abcom-btn--default abcom-upload__removebtn"><i class="fa fa-ban"></i>Remove</button></div>' +
						'</div>' +
					'</li>';

			upParent.find('.abcom-upload__list').append(html);
		};




		// for Upload Form with photo
		var photoForm = $('.abcom-upload--photo');

		if( photoForm.length ){
			photoForm.each(function(index){
				var upParent = $(this);
				var image = upParent.find('img');
				
				upParent.find('.abcom-upload__file').fileReaderJS({
					readAsDefault: "DataURL",
					on: {
					    load: function(e, file) {
					      var data = { e : e, file : file};
					      var filename = file.name;
						  var extension = filename.substr(filename.lastIndexOf('.') + 1, filename.length);
						  var extensions = ['jpg','jpeg','gif','png'];

					      if( extensions.indexOf(extension) != -1 ){
					      	image.attr('src', e.target.result);
					      }
					    }
					}
				});
			});
		}

	};

	var initDataTables = function(){
		if( $('.abcom-table').length ){
			$('.abcom-table').each(function(){
				$(this).dataTable();
			});
		}
	};

	var initMovables = function(){

		var renderMovables = function(currSet){
			var select = currSet.find('.abcom-movables__add__select select');
			var values = select.val();
			var currOpt = select[0].options;
			var elements = $('<div/>');
			var sortCount = 1;

			for( var key in currOpt ){
				if( typeof currOpt[key] != 'object'){
					continue;
				}

				if( currOpt[key].selected ){

					// Check for Newly Added
					if( !$(currOpt[key]).attr('data-sort') ){
						var allSelected = select.find('option:selected');
						var newSort = allSelected.length;
						$(currOpt[key]).attr('data-sort', newSort);	
					}

					var sort = $(currOpt[key]).attr('data-sort');
					var name = $(currOpt[key]).attr('data-name');
					var img = $(currOpt[key]).attr('data-photo');
					var pos = $(currOpt[key]).attr('data-position');
					var id = $(currOpt[key]).attr('data-id');		


					// console.log(currOpt[key]);
					var element = $('<div data-id="'+id+'" data-sort="'+sort+'" class="abcom-movables__data" />');
					var inner = '<img src="'+img+'" />';
					inner += '<h1>'+name+'</h1>';
					inner += '<p>'+pos+'</p>';
					inner += '<input type="text" name="members[]" placeholder="'+sort+'" />';
					inner += '<a href="#" class="abcom-movables__data__remove"><i class="fa fa-close"></i></a>';

					element.html(inner);
					elements.append(element);

					sortCount++;
				}else{

					// remove attributes on data-sort
					if( $(currOpt[key]).attr('data-sort') ){
						$(currOpt[key]).removeAttr('data-sort');
					}
				}
			}


			var movables = $(elements).find('.abcom-movables__data');

			// console.log($(elements));
			currSet.find('.abcom-movables__data').remove();

			sortMovables(movables, currSet);
			revalidateSorting(currSet);
			bind(currSet);

		};

		var sortMovables = function(elements, parentElem){
			elements.sort(function(a,b) {
				var ae = parseInt($(a).attr('data-sort')),
					be = parseInt($(b).attr('data-sort'));
			    return ae - be;
			}).appendTo(parentElem, 2000);
		};

		var revalidateSorting = function(parentElem){
			var elements = parentElem.find('.abcom-movables__data');
			var first = elements.first();
			var last = elements.last();

			// if( first.attr('data-sort') > 1 || last.attr('data-sort') < elements.length ){
				// Not good, must update
				var sortCount = 1;
				elements.each(function(){
					$(this).attr('data-sort', sortCount);
					$(this).find('input[type="text"]').attr('placeholder', sortCount);
					parentElem.find('.abcom-movables__add__select select option[data-id="'+$(this).attr('data-id')+'"]').attr('data-sort', sortCount);
					sortCount++;
				});
			// }
		};

		var bind = function(currSet){
			currSet.find('.abcom-movables__data__remove').click(function(e){
				var select = currSet.find('.abcom-movables__add__select select');
				var parentElem = $(this).parent('.abcom-movables__data');
				var oldValue = select.val();

				console.log(oldValue);
				oldValue.splice(oldValue.indexOf(parentElem.attr('data-id').toString()), 1);
				var newValue = oldValue;

				select.val(newValue);


				console.log(newValue);
				console.log(parentElem.attr('data-id'), parentElem.attr('data-sort'));

				renderMovables(currSet);

				e.preventDefault();
				// console.log(select.val());
			});

			currSet.find('.abcom-movables__data input').on('change', function(){
				var new_val = parseInt($(this).val()),
					old_val = parseInt($(this).parent('div.abcom-movables__data').attr('data-sort')),
					$movable_contents = currSet,
					$movables = $movable_contents.children('div.abcom-movables__data[data-sort]');

				if(new_val <= $movables.length){
					var pair = currSet.find('div.abcom-movables__data[data-sort="'+new_val+'"]'),
						curr = $(this).parent('div.abcom-movables__data');
					
					// Find pair and replace number
					currSet.find('div.abcom-movables__data[data-id="'+pair.attr('data-id')+'"]').attr('data-sort', old_val).children('input').attr('placeholder',old_val);
					// Change self
					curr.attr('data-sort', new_val);
					$(this).attr('placeholder',new_val);
					// console.log(curr.attr('data-sort'), pair.attr('data-sort'));

					// Sorting Ends
					sortMovables($movables, $movable_contents);
				}
				currSet.find('input').val("");
			});
		};

		if( $('.abcom-movables').length ){
			$('.abcom-movables').each(function(){

				var currSet = $(this);
				var addSection = currSet.find('.abcom-movables__add');
				var addSelection = addSection.find('.abcom-movables__add__select select');
				var addButton = addSection.find('.abcom-movables__add__btn');

				// Instantiate Select2 plugin
				addSelection.select2();

				// Render the List
				renderMovables(currSet);

				// Bind selection when closing
				addSelection.on('select2:close', function(){
					addSection.find('.abcom-movables__add__select').hide();
				});

				// Bind click on add button to display the select2 plugin
				addButton.click(function(e){
					e.preventDefault();
					addSection.find('.abcom-movables__add__select').show();
					addSelection.select2('open');
				});

				// Bind the change funciton of select2 plugin
				addSelection.on('change', function(){
					// console.log(addSelection[0].options);
					renderMovables(currSet);
				});

				// Bind change function on input for sorting
				// bind(currSet);

			});
		}
	};

	var initColorPicker = function(){
		var cpicker = $('.abcom-color');

		if( cpicker.length ){
			cpicker.each(function(){
				var currSet = $(this);
				currSet.spectrum();
				currSet.on('move.spectrum', function(e, tinycolor){
					var color = tinycolor.toHexString();
					$(this).find('div').css({ 'background-color' : color });
					$(this).attr('data-color', color);
				});
			});

		}
	};

	var initProgressBar = function(){
		var progress = $('div.abcom-progress');
		if( progress.length ){
			progress.each(function(){
				var currSet = $(this);
				var percent = currSet.data('value') / currSet.data('max');
				var finalWidth = currSet.width() * percent;
				var color = ( currSet.attr('data-color') ) ? currSet.attr('data-color') : 'default';
				if( color != 'default' ){ currSet.find('.abcom-progress__value').css({ 'background-color' : color }); }
				currSet.find('.abcom-progress__value').animate({ 'width' : finalWidth }, 750);
			});
		}
	};

	var initModule = function(){
		initDonut();
		initListing();
		initFileReader();
		initDateTimePicker();
		initDTpicker();
		initFilter();
		initDataTables();
		initMovables();
		initColorPicker();
		initProgressBar();
	};

	return {
		initModule : initModule,
		initDonut : initDonut,
		initListing : initListing,
		initFileReader : initFileReader,
		initDateTimePicker : initDateTimePicker,
		initDTpicker : initDTpicker,
		initFilter : initFilter,
		initDataTables : initDataTables,
		initMovables : initMovables,
		initColorPicker : initColorPicker,
		initProgressBar : initProgressBar
	}

}());