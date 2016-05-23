var aboitizApp = (function(){

	var initCORS = function(){
		var header = $('header.header .abnav');

		if( header.length ){
			var brand = header.find('.navbar-brand');
			var chars = brand.html().split('');
			var text = '';

			for(var key in chars){
				console.log(key);

				if( key == chars.length - 1 ){
					text += '<span>'+chars[key]+'</span>';
				}else{
					text += chars[key];
				}
			}

			brand.html(text);
		}
	};

	var initSideBar = function(){
		var sidebar = $('.main-content__side');
		var main = $('.main-content__main');

		if( sidebar.length ){
			// create a button
			var button = $('<a href="#" class="main-content__side__expand"><i class="fa fa-expand" aria-hidden="true"></i></a>');
			sidebar.prepend(button);

			sidebar.on('click', 'a.main-content__side__expand', function(e){
				e.preventDefault();

				sidebar.toggleClass('expand');
				main.toggleClass('expand');

				if( sidebar.hasClass('expand') ){
					$(this).html('<i class="fa fa-compress" aria-hidden="true"></i>');
				}else{
					$(this).html('<i class="fa fa-expand" aria-hidden="true"></i>');
				}
			});
			// bind button
		}
	};

	var initFilter = function(){
		var filter = $('.abcom-filter');
		if( filter.length ){
			filter.each(function(){
				var sfilter = $(this);
				var cat = sfilter.find('.abcom-filter__category');
				var entries = sfilter.find('.abcom-filter__entries');
				var search = sfilter.find('.abcom-filter__btn--search');
				// var clear = sfilter.find('.abcom-filter__btn--clear');

				sfilter.find('.abcom-filter__type').hide();

				var clearform = function(){
					var all = sfilter.find('select, input').not('.abcom-filter__category, .abcom-filter__entries');
					all.val('');
					all.removeClass('has-error');
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

				search.on('click', function(e){
					e.preventDefault();

					var curr = $(this);
					var currParent = curr.parents('.abcom-filter');
					var cat = currParent.find('.abcom-filter__category');
					var visible = currParent.find('select:visible, input:visible').not('.abcom-filter__category, .abcom-filter__entries');

					if( currParent.length ){
						
						if( cat.val().toLowerCase() == "none" ){
							cat.addClass('has-error');
						}else{
							cat.removeClass('has-error');
						}


						// currParent.find('select, input').not('.abcom-filter__category, .abcom-filter__entries')
					}

					total_checked = 0;
					if( visible.length ){

						visible.each(function(index){
							if( $(this).val() == "" ){
								$(this).addClass('has-error');
							}else{
								total_checked++;
								$(this).removeClass('has-error');
							}
						});
					}

					var currCallback = curr.data('callback');
					if( currCallback ){
						// convert string to function;
						var callback = window[currCallback];

						if( total_checked == visible.length && total_checked != 0 ){
							if( typeof callback == 'function'){
								callback();
							}
						}
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

	var initMoMListing = function(){
		var elem = $('.abcom-list--mom');

		var renderList = function(elem){
			var html = "";
			var currSel = elem;
			var hidden = currSel.find('input[data-name="hidden"]');

			if( hidden.val() ){

				// convert to json
				var values = eval("(" + hidden.val() + ")");

				for(var key in values){
					var stype = values[key].service_type;
					var cat = values[key].category;
					var scata = values[key].subcata;
					var scatb = values[key].subcatb;

					// console.log( key, values, values[key] );
					html += '<tr data-index="'+key+'" class="abcom-list__item">';
					html += '<td>' + stype.name + '</td>';
					html += '<td>' + cat.name + '</td>';
					html += '<td>' + scata.name + '</td>';
					html += '<td>' + scatb.name + '</td>';
					html += '<td><a href="javascript:;" class="abcom-list__item__link--delete"><i class="fa fa-close"></i></a></td>';
					html += '</tr>';
				}

				var list = currSel.find('.abcom-list__items');
				var fix = list.find('.abcom-list__item--fix');

				if( fix.length ){
					list.find('.abcom-list__item').remove();
				}

				list.append(html);
				list.find('.abcom-list__item__link--delete').unbind('click');
				list.find('.abcom-list__item__link--delete').click(function(e){
					var thisList = $(this).parent('td').parent('.abcom-list__item');
					var index = thisList.data('index');

					// Remove from selection -- Array
					var newValue = values;
					newValue.splice(index, 1);

					thisList.remove();

					// Set to semi-global
					currSetValues = newValue;

					hidden.val(JSON.stringify(newValue));

					renderList(currSel);
				});
			}
		};

		if( elem.length ){
			elem.each(function(){
				var currSet = $(this);
				var currSetValues = [];
				var addButton = currSet.find('.abcom-list__add');
				var required = currSet.find('[data-required="true"]');
				var hidden = currSet.find('input[data-name="hidden"]');
				var stype = currSet.find('select[data-name="stype"]');
				var cat = currSet.find('select[data-name="cat"]');
				var scata = currSet.find('select[data-name="scata"]');
				var scatb = currSet.find('select[data-name="scatb"]');

				renderList(currSet);

				currSet.find('select').on('change', function(){
					var curr = $(this);
					if( curr.val() != "none"){
						curr.removeClass('has-error');
					}
				});

				addButton.on('click', function(e){
					e.preventDefault();
					if( required ){
						if( required.val() != "none" ){
							// Proceed

							if( hidden.val() ){
								currSetValues = eval("(" + hidden.val() + ")");
							}

							var data = {
								"service_type" : {
									"id" : stype.val(),
									"name" : ( stype.val() != "none") ? $(stype[0].options[stype[0].selectedIndex]).text() : "-"
								},
								"category" : {
									"id" : cat.val(),
									"name" : ( cat.val() != "none") ? $(cat[0].options[cat[0].selectedIndex]).text() : "-"
								},	
								"subcata" : {
									"id" : scata.val(),
									"name" : ( scata.val() != "none") ? $(scata[0].options[scata[0].selectedIndex]).text() : "-"
								},
								"subcatb" : {
									"id" : scatb.val(),
									"name" : ( scatb.val() != "none") ? $(scatb[0].options[scatb[0].selectedIndex]).text() : "-"
								}
							};
							// KJHJFSHAKJShdKJSADKJASKJHSADHAJSGDJSAGDASHLKJDSAd

							// check if the current value already exists inside
							var key;
							var marker = false;
							for( key in currSetValues ){
								var stypeObj = currSetValues[key].service_type;
								var catObj = currSetValues[key].category;
								var subcataObj = currSetValues[key].subcata;
								var subcatbObj = currSetValues[key].subcatb;

								if( stype.val() == stypeObj.id && cat.val() == catObj.id && scata.val() == subcataObj.id && scatb.val() == subcatbObj.id ){
									marker = true;
								}
							}

							if( !marker ){
								// Append to array
								currSetValues.push(data);
								
								// Set inputs to blank	
								stype.removeClass('has-error');
								cat.removeClass('has-error');
								scata.removeClass('has-error');
								scatb.removeClass('has-error');
								
								// Reset inputs
								stype.find('option[value="none"]').prop('selected', true);
								cat.find('option[value="none"]').prop('selected', true);
								scata.find('option[value="none"]').prop('selected', true);
								scatb.find('option[value="none"]').prop('selected', true);
								
							}else{
								stype.addClass('has-error');
								cat.addClass('has-error');
								scata.addClass('has-error');
								scatb.addClass('has-error');
							}

							var datatext = JSON.stringify(currSetValues);

							hidden.val(datatext);
							renderList(currSet);
						}else{
							required.addClass('has-error');
						}
					}
				});
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
			var texts = currSel.select2('data');

			for(var key in values){
				// console.log( key, values, values[key]);
				console.log();
				html += '<li class="abcom-list__item" data-index="'+key+'" data-id="'+values[key]+'">'+texts[key].text+'<a href="javascript:;" class="abcom-list__item__link"><i class="fa fa-close"></i></a></li>';
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


		// For features -- Has designation only textbox
		var v2 = $('div.abcom-list--v2');

		var renderListv2 = function(elem){
			var html = "";
			var currSel = elem;
			var hidden = currSel.find('input[data-name="hidden"]');

			if( hidden.val() ){

				// convert to json
				var values = eval("(" + hidden.val() + ")");

				for(var key in values){
					// console.log( key, values, values[key] );
					html += '<li class="abcom-list__item" data-index="'+key+'" data-value-name="'+values[key].name+'" data-value-designation="'+values[key].designation+'">'+values[key].name+ ' - ' + values[key].designation +'<a href="javascript:;" class="abcom-list__item__link"><i class="fa fa-close"></i></a></li>';
				}

				var list = currSel.find('.abcom-list__items');
				list.html(html);
				list.find('.abcom-list__item__link').unbind('click');
				list.find('.abcom-list__item__link').click(function(e){
					var thisList = $(this).parent('.abcom-list__item');
					var index = thisList.data('index');

					// Remove from selection -- Array
					var newValue = values;
					newValue.splice(index, 1);

					thisList.remove();

					// Set to semi-global
					currSetValues = newValue;

					hidden.val(JSON.stringify(newValue));

					renderListv2(currSel);
				});
			}
		};

		if( v2.length ){
			v2.each(function(index){
				var currSet = $(this);
				var currSetValues = [];

				var addButton = currSet.find('.abcom-list__add');
				var nameInput = currSet.find('input[data-name="name"]');
				var desiInput = currSet.find('input[data-name="designation"]');
				var hiddInput = currSet.find('input[data-name="hidden"]');

				renderListv2(currSet);

				nameInput.on('change', function(){
					$(this).removeClass('has-error');
				});

				desiInput.on('change', function(){
					$(this).removeClass('has-error');
				});

				addButton.on('click', function(e){
					e.preventDefault();
					var inputs = currSet.find('input');
					
					inputs.each( function(){
						var currIn = $(this);
						if( !currIn.val() ){
							currIn.addClass('has-error');
						}else{
							currIn.removeClass('has-error');
						}
					});


					var name = nameInput;
					var designation = desiInput;
					var hidden = currSet.find('input[data-name="hidden"]');

					if( hidden.val() ){
						currSetValues = eval("(" + hidden.val() + ")");
					}

					if( name.val() && designation.val() ){
						var hidden = currSet.find('input[data-name="hidden"]');
						var data = {
							"name" : name.val(),
							"designation" : designation.val()
						};


						// check if the current value already exists inside
						var key;
						var marker = false;
						for(key in currSetValues){
							var vname = currSetValues[key].name;
							var vdesignation = currSetValues[key].designation;

							if( vname == data.name && vdesignation == data.designation ){
								marker = true;
							}
						}

						// if( !marker ){
							currSetValues.push(data);
							// Set inputs to blank
							name.val('').removeClass('has-error');
							designation.val('').removeClass('has-error');
							
						// }else{
						// 	name.addClass('has-error');
						// 	designation.addClass('has-error');
						// }

						var datatext = JSON.stringify(currSetValues);

						hidden.val(datatext);
						renderListv2(currSet);
					}
				});

			});
		}



		var v3 = $('.abcom-list--v3');

		var renderListv3 = function(elem){
			var html = "";
			var currSel = elem;
			var hidden = currSel.find('input[data-name="hidden"]');

			if( hidden.val() ){

				// convert to json
				var values = eval("(" + hidden.val() + ")");

				for(var key in values){
					// console.log( key, values, values[key] );
					html += '<li class="abcom-list__item" data-index="'+key+'" data-value-date="'+values[key].date+'" data-value-type="'+values[key].type+'">'+values[key].date+ ' - ' + values[key].type +'<a href="javascript:;" class="abcom-list__item__link"><i class="fa fa-close"></i></a></li>';
				}

				var list = currSel.find('.abcom-list__items');
				list.html(html);
				list.find('.abcom-list__item__link').unbind('click');
				list.find('.abcom-list__item__link').click(function(e){
					var thisList = $(this).parent('.abcom-list__item');
					var index = thisList.data('index');

					// Remove from selection -- Array
					var newValue = values;
					newValue.splice(index, 1);

					thisList.remove();

					// Set to semi-global
					currSetValuesV3 = newValue;

					hidden.val(JSON.stringify(newValue));

					renderListv3(currSel);
				});

			}
		};

		if( v3.length ){
			v3.each(function(index){
				var currSet = $(this);
				var currSetValuesV3 = [];

				var addButton = currSet.find('.abcom-list__add');
				var dateInput = currSet.find('input[data-name="date"]');
				var typeInput = currSet.find('select[data-name="type"]');
				var hiddInput = currSet.find('input[data-name="hidden"]');

				renderListv3(currSet);

				// Resets
				dateInput.on('change', function(){
					$(this).removeClass('has-error');
				});

				typeInput.on('change', function(){
					$(this).removeClass('has-error');
				});

				addButton.on('click', function(e){
					e.preventDefault();

					if( !dateInput.val() ){ 
						dateInput.addClass('has-error');
					}else{
						dateInput.removeClass('has-error');
					}

					if( typeInput.val() != "none" ){ 
						typeInput.removeClass('has-error');
					}else{
						typeInput.addClass('has-error');
					}

					var hidden = currSet.find('input[data-name="hidden"]');

					if( hidden.val() ){
						currSetValuesV3 = eval("(" + hidden.val() + ")");
					}

					if( dateInput.val() && typeInput.val() != "none" ){
						var data = {
							"date" : dateInput.val(),
							"type" : $(typeInput[0].options[typeInput[0].selectedIndex]).text(),
							"id" : typeInput.val()
						};


						// check if the current value already exists inside
						var key;
						var marker = false;
						for(key in currSetValuesV3){
							var vdate = currSetValuesV3[key].date;
							var vtype = currSetValuesV3[key].type;

							if( vdate == data.date && vtype == data.type ){
								marker = true;
							}
						}

						if( !marker ){
							currSetValuesV3.push(data);
							// Set inputs to blank
							dateInput.val('').removeClass('has-error');
							typeInput.removeClass('has-error');
							typeInput.find('option[value="none"]').prop('selected', true);
						}else{
							dateInput.addClass('has-error');
							typeInput.addClass('has-error');
						}

						var datatext = JSON.stringify(currSetValuesV3);

						hidden.val(datatext);
						renderListv3(currSet);
					}

				});

			});
		}
	};

	// Used in form dates only
	var initDTpicker = function(holidays){
		var todisable = ( holidays !== null ) ? holidays : null;

		if( $('.abcom-form__date').length ){
			$('.abcom-form__date').each(function(){
				var curr = $(this);
				// Set generic options for date time picker
				var options = {
					format: 'MM/DD/YYYY'
				}

				// Weekend disable
				if( curr.data('disable-weekend') ){
					options.daysOfWeekDisabled = [0,6]
				}

				// Holiday disable
				// Set special disabler for holidays
				if( todisable !== null && curr.data('disable-holidays')){
					options.disabledDates = todisable;
				}

				$(this).datetimepicker(options);	
			})
		}

		if( $('.abcom-form__daterange').length ){
			$('.abcom-form__daterange').each(function(){
				var currSet = $(this),
					currFrom = currSet.find('.abcom-form__daterange--from'),
					currTo = currSet.find('.abcom-form__daterange--to');

				// Set generic options for date time picker
				var options = {
					format: 'MM/DD/YYYY'
				}

				// Weekend disable
				if( currSet.data('disable-weekend') || currFrom.data('disable-weekend') || currTo.data('disable-weekend') ){
					options.daysOfWeekDisabled = [0,6]
				}

				// Holiday disable
				// Set special disabler for holidays
				if( todisable !== null && ( currSet.data('disable-holidays') || currFrom.data('disable-holidays') || currTo.data('disable-holidays'))){
					options.disabledDates = todisable;
				}

				// Set special disabler for holidays
				// if( todisable !== null ){
				// 	options.disabledDates = todisable;
				// }

				currFrom.datetimepicker(options);
				currFrom.on("dp.change", function (e) {
					currTo.data("DateTimePicker").minDate(e.date);
		        });

		        options.useCurrent = false;

		        currTo.datetimepicker(options);
				currTo.on("dp.change", function (e) {
					currFrom.data("DateTimePicker").maxDate(e.date);
		        });
			});
		}
	};

	var initDateTimePicker = function(holidays){
		var todisable = ( holidays !== null ) ? holidays : null;
		var inputs = $('.abcom-filter__type--date');

		if( inputs.length ){

			inputs.each(function( index ){
				// Set generic options for date time picker
				var options = {
					format: 'MM/DD/YYYY'
				};

				

				var currentSet = $(this);
				var dates = $(this).find('.abcom-filter__date');
				var dtinput = dates.find('input');
				
				if( dates.length === 1 ){
					// single
					// Weekend disable
					if( dtinput.data('disable-weekend') ){
						options.daysOfWeekDisabled = [0,6];
						console.log('what!');
					}

					// Holiday disable
					// Set special disabler for holidays
					if( todisable !== null && dtinput.data('disable-holidays')){
						options.disabledDates = todisable;
					}

					dates.datetimepicker(options);

				}else if( dates.length === 2){
					// daterange
					dates.each(function(){
						var current = $(this);
						var cinput = current.find('input');

						// Weekend disable
						if( cinput.data('disable-weekend') ){
							options.daysOfWeekDisabled = [0,6]
						}

						// Holiday disable
						// Set special disabler for holidays
						if( todisable !== null && cinput.data('disable-holidays')){
							options.disabledDates = todisable;
						}

						if( current.is($('.abcom-filter__date[data-role="from"]')) ){
							var from = current;
							options.useCurrent = true;
							from.datetimepicker(options);
							from.on("dp.change", function (e) {
								currentSet.find('.abcom-filter__date[data-role="to"]').data("DateTimePicker").minDate(e.date);
					        });
						}else if( current.is($('.abcom-filter__date[data-role="to"]')) ){
							var to = current;
							options.useCurrent = false;
							to.datetimepicker(options);
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
						      	};

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

			upParent.find('.abcom-upload__clearbtn').unbind('click');
			upParent.find('.abcom-upload__clearbtn').click(function(e){
				e.preventDefault();

				// Clear Array
				allFiles[index].length = 0;
				upParent.find('.abcom-upload__list__item').remove();
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
				var curr = $(this);
				var options = {};
				
				if( curr.data('has-scroll') ){
					options.scrollX = true;
				}

				$(this).dataTable(options);
			});
		}
	};

	var initMembers = function(){
		var elem = $('.abcom-members');
		var modal = $('.abcom-members__modal');
		var elemValues = [];

		if( elem.length ){
			elem.each(function(eindex){
				var currSet = $(this);
				var members = currSet.find('.abcom-members__member');
				var memberValues = [];

				if( members.length ){
					members.each(function(mindex){

						var currMem = $(this);
						var owner = currMem.find('.abcom-members__member__name');
						var companies = currMem.find('.abcom-members__member__companies__name');
						if( companies.length ){
							var text = companies.text().split(";");
							var len = text.length;
							var html = "";

							companies.attr('data-eindex', eindex);
							companies.attr('data-mindex', mindex);

							memberValues[mindex] = {};
							memberValues[mindex].data = text;
							memberValues[mindex].owner = owner.text();

							var more = false;
							var loop = len;
							if( len != 0 ){
								if( len > 4 ){
									more = true;
									loop = 3;
								}

								var i = 0;
								for(i; i < loop; i++){
									html += '<p>'+text[i]+'</p>';
								}

								if( more === true ){
									html += '<a href="#" class="abcom-members__member__companies__more">more...</a>';
								}  
							}

							companies.html(html);

							// var more = companies.find('a.abcom-members__member__companies__more');

							companies.on('click', 'a.abcom-members__member__companies__more', function(e){
								e.preventDefault();

								var curr = $(this);
								var currParent = curr.parent('.abcom-members__member__companies__name');
								var elemIndex = currParent.attr('data-eindex');
								var memIndex = currParent.attr('data-mindex');

								modal.attr('data-eindex', elemIndex);
								modal.attr('data-mindex', memIndex);
								modal.modal('show');
							});
						}

					});
				}

				elemValues[eindex] = memberValues;
			});
		}

		modal.on('show.bs.modal', function (e) {
			var curr = $(this);
			var values = elemValues[curr.attr('data-eindex')][curr.attr('data-mindex')];
			var html = "";
			var len = values.data.length;
			var i = 0;
			var owner = curr.find('.abcom-members__modal__title');
			
			for(i; i < len; i++){
				html += '<p class="abcom-members__modal__company">'+values.data[i]+'</p>';
			}

			curr.find('.abcom-members__modal__company').remove();
			$(html).insertAfter('.abcom-members__modal__title');
			owner.find('b').html(values.owner);
		});
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
			// Delegate
			currSet.find('.abcom-movables__data').on('click', '.abcom-movables__data__remove', function(e){
				var select = currSet.find('.abcom-movables__add__select select');
				var parentElem = $(this).parent('.abcom-movables__data');
				var oldValue = select.val();

				// console.log(oldValue);
				oldValue.splice(oldValue.indexOf(parentElem.attr('data-id').toString()), 1);
				var newValue = oldValue;

				select.val(newValue);


				// console.log(newValue);
				// console.log(parentElem.attr('data-id'), parentElem.attr('data-sort'));

				renderMovables(currSet);

				e.preventDefault();
				// console.log(select.val());
			});

			currSet.on('change', '.abcom-movables__data input', function(){
				var new_val = parseInt($(this).val()),
					old_val = parseInt($(this).parent('div.abcom-movables__data').attr('data-sort')),
					$movable_contents = currSet,
					$movables = $movable_contents.children('div.abcom-movables__data[data-sort]');

				if(new_val <= $movables.length){
					var pair = currSet.find('div.abcom-movables__data[data-sort="'+new_val+'"]'),
						curr = $(this).parent('div.abcom-movables__data');
						currSel = currSet.find('div.abcom-movables__add__select select option[data-id="'+curr.attr('data-id')+'"]');
					
					// Find pair and replace number
					currSet.find('div.abcom-movables__add__select select option[data-id="'+pair.attr('data-id')+'"]').attr('data-sort', old_val);
					currSet.find('div.abcom-movables__data[data-id="'+pair.attr('data-id')+'"]').attr('data-sort', old_val).children('input').attr('placeholder',old_val);
					
					// Change self
					currSel.attr('data-sort', new_val);
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
				addSection.on('select2:close', '.abcom-movables__add__select select', function(){
					addSection.find('.abcom-movables__add__select').hide();
				});

				// Bind click on add button to display the select2 plugin
				addSection.on('click', '.abcom-movables__add__btn', function(e){
					e.preventDefault();
					addSection.find('.abcom-movables__add__select').show();
					addSelection.select2('open');
				});

				// Bind the change funciton of select2 plugin
				addSection.on('change', '.abcom-movables__add__select select', function(){
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

	var initModals = function(){
		var button = $('[data-target][data-src]');

		var resizeIframe = function (obj) {
		    obj.style.height = obj.contentWindow.document.body.scrollHeight + 'px';
		};

		if( button.length ){
			button.each(function( index ){
				var curr = $(this);

				curr.on('click', function(e){
					e.preventDefault();

					var target = $(this).data('target');
					var src = $(this).data('src');

					$(target).on('show.bs.modal', function(){
						var iframe = $(this).find('iframe');
						iframe.attr('src', src);
						iframe.on('load', function(){
							resizeIframe(this);
						});
					});

					$(target).modal({show: true});
				});

			});
		}
	};

	var initLeave = function(){
		window.onbeforeunload = function(e) {
			var text = 'There is a form that has been filled-in, all unsaved data will be deleted.'
			
			// Exceptions for Form elements checking
			// Filter Component
			// Modal Component

			// var form = $('form');
			var input = $('input:not([type="submit"][type="button"]), select, textarea').filter(function() {
				var curr = $(this);
				var abfilter = curr.closest('.abcom-filter');
				var abmodal = curr.closest('.modal');
				var abdtable = curr.closest('.dataTables_wrapper');
				var abauth = curr.closest('.auth__button');
				if( !abauth.length && !abfilter.length && !abmodal.length && !abdtable.length ){
					if( curr.val() != "" && curr.val() != "none" && curr.val() != "0" && curr.val().toString().toLowerCase().indexOf('select') == -1 ){
		        		return this;
					}
				}
		    });

		    if( input.length ){
		    	console.log(input);
				return text;
				// return input.length + " akjshdfkahdfkadf " +text;
		    }
		};

		$('[data-is-submit="true"]').parents('form').on('submit', function(){
			window.onbeforeunload = function(e){ console.log('onbeforeunload reset')};
			var r = confirm("Are you sure you want to Submit?");
			return r;
		});
	};

	var initPreLoader = function(){
		var preloader = $('<div class="abcom-preloader" />');
		var plContainer = $('<div class="abcom-preloader__loader"/>');
		var plImage = $('<img class="abcom-preloader__image" src="/assets/images/preloader.gif" />');
		var plText = $('<span class="abcom-preloader__text">Please wait...</span>');

		if( $('.abcom-preloader').length === 0 ){
			plContainer.html(plImage);
			plContainer.append(plText);
			preloader.html(plContainer);
			$('body').append(preloader);
		}

		var showPL = function(){
			var preloader = $(document).find('.abcom-preloader');
			preloader.fadeIn(250);
		};

		var hidePL = function(){
			var preloader = $(document).find('.abcom-preloader');
			preloader.fadeOut(250);
		};

		return {
			showPL : showPL,
			hidePL : hidePL
		}

	};

	var initModule = function(param){
		var holidays = null,
			allowLeave = false;

		if( param ){
			if( param.holidays ){
				holidays = param.holidays;
			}

			if( param.leavePrompt ){
				allowLeave = param.leavePrompt;
			}
		}

		initDonut();
		initListing();
		initFileReader();
		initDateTimePicker(holidays);
		initDTpicker(holidays);
		initFilter();
		// initDataTables();
		initMovables();
		initColorPicker();
		initProgressBar();
		initModals();
		initMoMListing();
		initMembers();

		if( allowLeave ){
			initLeave();
		}

		initSideBar();
		initCORS();
		initPreLoader();
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
		initProgressBar : initProgressBar,
		initModals : initModals,
		initMoMListing : initMoMListing,
		initMembers : initMembers,
		initLeave : initLeave,
		initSideBar : initSideBar,
		initCORS : initCORS,
		initPreLoader : initPreLoader
	};

}());