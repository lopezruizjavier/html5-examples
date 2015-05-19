$(document).ready(function()
{
	$(window).resize(function()
	{
		$('.container').css(
		{
			position: 'absolute',
			left: ($(window).width() - $('.container').outerWidth())/2,
			top: ($(window).height() - $('.container').outerHeight())/2
		});	
 	});
 
 	$(window).resize();

 	setInterval(function()
 	{
    	if ($('#light').attr("src") == "images/green.png")
    		$('#car').attr("src", "images/go.png");
    	else if ($('#light').attr("src") == "images/red.png")
    		$('#car').attr("src", "images/stop.png");
    	else if ($('#light').attr("src") == "images/yellow.png")
    		$('#car').attr("src", "images/warn.png");
	}, 1);

	var worker = new Worker('js/lights.js');

	worker.onmessage = function (event)
	{
		$('#light').attr("src", event.data);
   	};
});