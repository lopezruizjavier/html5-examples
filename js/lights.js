var n = 0;

var light = "";

while (true)
{
	var green = "images/green.png";
 	var yellow = "images/yellow.png";
 	var red = "images/red.png";

	if (n == 0) // red
		light = green;
	else if (n == 1) // green
		light = yellow;
	else // warn
		light = red;

	n = (n + 1) % 3;

	postMessage(light);

	sleep(6000);
}


function sleep(milliseconds)
{
	var start = new Date().getTime();

	for (var i = 0; i < 1e7; i++) 
		if ((new Date().getTime() - start) > milliseconds)
			break;
}