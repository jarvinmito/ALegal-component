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


	var initFileReader = function(){
		var upBtn = $('.abcom-upload__addbtn');
		var upParent = upBtn.parents('.abcom-upload');
		var allFiles = [];
		// upBtn.click(function(){
		// 	upParent.find('.abcom-upload__file').click();
		// });

		$('.abcom-upload__file').fileReaderJS({
			readAsDefault: "DataURL",
			on: {
			    load: function(e, file) {
			      var data = { e : e, file : file};
			      if( extCheck(file) ){
			      	allFiles.push(data);
			      	renderList(file);
			      }
			    }
			}
		});

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

		var renderList = function(filedata){
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
							'<div class="col-sm-3 abcom-container--right"><button class="btn abcom-btn abcom-btn--default"><i class="fa fa-ban"></i>Remove</button></div>' +
						'</div>' +
					'</li>';

			upParent.find('.abcom-upload__list').append(html);
		};
	};

	var initModule = function(){
		console.log('Aboitiz Yeah!');
	};

	return {
		initModule : initModule,
		initDonut : initDonut,
		initListing : initListing,
		initFileReader : initFileReader
	}

}());