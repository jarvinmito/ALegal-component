/*!---------------------------------------------------------------------
 * ---------------------------------------------------------------------
 * ------------██╗---██╗-██████╗-███╗---██╗██████╗-██╗---██╗------------
 * ------------╚██╗-██╔╝██╔═══██╗████╗--██║██╔══██╗██║---██║------------
 * -------------╚████╔╝-██║---██║██╔██╗-██║██║--██║██║---██║------------
 * --------------╚██╔╝--██║---██║██║╚██╗██║██║--██║██║---██║------------
 * ---------------██║---╚██████╔╝██║-╚████║██████╔╝╚██████╔╝------------
 * ---------------╚═╝----╚═════╝-╚═╝--╚═══╝╚═════╝  ╚═════╝-------------
 * ---------------------------------------------------------------------
 * ----------------------Technology Made Human--------------------------
 * ---------------------------------------------------------------------
 * ---------------------------------------------------------------------
*/
// Project Name :: Aboitiz Legal
// App Core Functions

var App = (function(){

	// Start Setup
	// Purpose : Holds necessary information about the Game App
	var configMap = {},
		jqueryMap = {
			$main : $('.ab-wrapper'),
			$header : $('header.header'),
			$body : $('.main-content__main'),
			$footer : $('footer.footer')
		};
	// End Setup


	// Start Module /bind/
	// Purpose : Binds click on each option
	var bind = function(){
		$('.abnav__link').click(function(e){
			// App.Router.route($(this).attr('href'));
			$('.abnav__link').not($(this)).parent().removeClass('active');
			$(this).parent().addClass('active');
			// e.preventDefault();
		});
	};
	// End Module /bind/

	// Start Module /bind/
	// Purpose : Binds click on each option
	var unbind = function(){
	};
	// End Module /bind/
	
	// Start Module /initModule/
	// Purpose : Initializes our Environment App
	var initModule = function(){
		// mainit
		// initialization code for app here
		console.log('It\'s alive!!!');
		
		// jqueryMap.$body.html(App.Templates['yhome']());

		App.Router.init();
		jqueryMap.$header.html(App.Templates['yheader']());
		jqueryMap.$footer.html(App.Templates['yfooter']());
		
		bind();
	};


	return {
		initModule : initModule
	};

}());