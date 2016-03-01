App.Router = (function(){

	var routes = {
			"#" : App.Pageloader.home,
			"#home" : App.Pageloader.home,
			"#templates" : App.Pageloader.templates,
			"#reusables" : App.Pageloader.reusables,
			"#specifics" : App.Pageloader.specifics,
			"error" : App.Pageloader.error
		};

	var route = function(link){
		console.log(link);

		// marker active
		var curLink = (link == "#") ? $('.abnav__link[href="#home"]') : $('.abnav__link[href="'+link+'"]'),
			allLink = $('.abnav__link');

		allLink.not(curLink).parent().removeClass('active');
		curLink.parent().addClass('active');

		if(link){
			if( typeof routes[link] == 'function' ){
				routes[link]();
			}else{
				// 404 here;
				routes['error']();
			}
		}
	};

	var init = function(){
		window.addEventListener('hashchange', function(event){
			route(window.location.hash);
		}, false);

		window.addEventListener('load', function (event) {
			route(window.location.hash || "#");
		}, false);
	};

	return {
		init : init,
		route : route
	};


}());