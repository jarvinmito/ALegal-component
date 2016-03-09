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
		var elem = $('.abcom-list__dropdown');
		var renderList = function(elem){
			var html = "";
			var values = selection.val();

			for(var key in values){
				// console.log( key, values, values[key]);
				html += '<li class="abcom-list__item" data-index="'+key+'" data-value="'+values[key]+'">'+values[key]+'<a href="javascript:;" class="abcom-list__item__link"><i class="fa fa-close"></i></a></li>';
			}

			var id = elem.attr('id');
			var list = $('.abcom-list[data-parent="'+id+'"]');
			list.html(html);
			list.find('.abcom-list__item__link').unbind('click');
			list.find('.abcom-list__item__link').click(function(e){
				var thisList = $(this).parent('.abcom-list__item');
				var index = thisList.data('index');

				// Remove from selection -- Array
				var newValue = selection.val();
				newValue.splice(index, 1);

				thisList.remove();

				selection.val(newValue);
				selection.trigger('change');
			});
		};

		if( elem.length ){
			var selection = elem.select2({
					placeholder : 'Select ' + elem.data('title')
				});

			renderList(elem);
			selection.on('change', function(){ renderList(elem); });

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
				allFiles[index] = [];
				
				upParent.find('.abcom-upload__file').fileReaderJS({
					readAsDefault: "DataURL",
					on: {
					    load: function(e, file) {
					      var data = { e : e, file : file};
					      if( extCheck(file) ){
					      	allFiles[index].push(data);
					      	renderList(file, upParent, index);
					      	// bind(file, upParent, index, data);
					      }
					    }
					}
				});
			});
		}

		var bind = function(file, upParent, index, data){
			upParent.find('.abcom-upload__removebtn').unbind('click');
			upParent.find('.abcom-upload__removebtn').click(function(){
				allFiles[index].splice(allFiles[index].indexOf(data), 1);
				renderList(file, upParent, index);
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

		var renderList = function(filedata, upParent, index){
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

			var filename = filedata.name;
			var size = filedata.size;
			var extension = filename.substr(filename.lastIndexOf('.') + 1, filename.length);

			var html = '<li class="abcom-upload__list__item container-fluid">' +
						'<div class="row">' +
							'<div class="col-sm-2"><span class="abcom-upload__file__icon">'+icons[extension]+'</span></div>' +
							'<div class="col-sm-4">'+filename+'</div>' +
							'<div class="col-sm-3">'+formatBytes(size)+'</div>' +
							'<div class="col-sm-3 abcom-container--right"><button class="btn abcom-btn abcom-btn--default abcom-upload__removebtn"><i class="fa fa-ban"></i>Remove</button></div>' +
						'</div>' +
					'</li>';

			upParent.find('.abcom-upload__list').append(html);
		};
	};

	var initDataTables = function(){
		$('.abcom-table').dataTable();
	};

	var initModule = function(){
		initDonut();
		initListing();
		initFileReader();
		initDateTimePicker();
		initFilter();
		initDataTables();
	};

	return {
		initModule : initModule,
		initDonut : initDonut,
		initListing : initListing,
		initFileReader : initFileReader,
		initDateTimePicker : initDateTimePicker,
		initFilter : initFilter,
		initDataTables : initDataTables
	}

}());