$(document).ready(function(){
	var argus = {
		leavePrompt : false,
		holidays : ['04/21/2016','04/20/2016']
	};

	aboitizApp.initModule(argus);
});


$.listen('parsley:field:error', function(ParsleyField) {
	var theInput = ParsleyField.$element;
    var theMsg = ParsleyField.$element.next('ul');
    var theTop = theInput.offset().top - theMsg.outerHeight(true) + 5;
    var theLeft = theInput.offset().left;
    var currElem = ParsleyField.$element;
    
    theMsg.css({
     "position" : "absolute",
     "top" : theTop,
     "left" : theLeft
    });

    theMsg.addClass('abcom-parsley__list');
});

$.listen('parsley:field:success', function(ParsleyField) {
    var theMsg = ParsleyField.$element.next('ul');
    theMsg.remove();
});