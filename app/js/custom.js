var initDonut = function(elem){
	// Interpret value as %
	var value = elem.find('h1').html();
	var circle = elem.find('.circle_animation');
	var getPercentage = Math.abs(((value / 100) * 440) - 440);
	// subtract 440 to reverse the effect
	// 440 = 0% and 0 = 100% in the stroke-dashoffset of svg in css

	circle.animate({'stroke-dashoffset' : getPercentage}, 1000);
};