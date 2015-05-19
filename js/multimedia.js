var duration = 6000;

$(document).ready(function()
{
	$("#web").delay(duration).queue(function (next) {
	    $(this).fadeIn("slow");
	    $(this).css('z-index', 9999);
	    $(this).css('position', 'relative');
	    next();
	});

	$(window).resize(function()
	{
		$('#trailer').css(
		{
			position: 'absolute',
			left: ($(window).width() - $('#trailer').outerWidth())/2,
		});	
 	});
 
 	$(window).resize();
});