var map = null;
var markerMe = null;

$(document).ready(function()
{
	map = L.map('mapa').setView([40.51298, -3.34954], 10);

	L.tileLayer('http://{s}.tiles.mapbox.com/v3/dennisl.map-6g3jtnzm/{z}/{x}/{y}.png', {
	    maxZoom: 18
	}).addTo(map);

	var epsIcon = L.icon({
		iconUrl: 'images/eps.jpg',
		iconSize:     [64, 64],
		iconAnchor:   [32, 64],
	});

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
});

function markMe(position)
{
	markerMe = L.marker([position.coords.latitude, position.coords.longitude]).addTo(map)
	markerMe.bindPopup("¡Estoy aquí (" + position.coords.latitude + ", " + position.coords.longitude + ")!");
	map.setView([position.coords.latitude, position.coords.longitude], 16);
	$('#locate').addClass("pure-button pure-button-success");	
}

function showError(error)
{    
    var message = null;  
    
	if (error.core == error.PERMISSION_DENIED)
		message = "El usuario no ha concedido los privilegios de geolocalización.";  
	else if (error.core == error.POSITION_UNAVAILABLE)
		message = "Posicion no disponible.";  
	else if (error.core == error.TIMEOUT)
		message = "Demasiado tiempo intentando obtener la localización del usuario.";  
	else 
		message = "No se ha podido geolocalizar con la configuración de su navegador.";  

	$('#locate').addClass("pure-button pure-button-error");
	alert(message);
}  

function geoMe()
{
	if (map !== null)
	{
		 if (navigator.geolocation)
		 { 
		 	if (markerMe !== null)
				map.removeLayer(markerMe);

			var queryOptions  = {timeout:5000, maximumAge:20000, enableHighAccurace:false};
  			navigator.geolocation.getCurrentPosition(markMe, showError, queryOptions);	
		}
		else
		{
			$('#locate').addClass("pure-button pure-button-error");	
			alert("La geolocalizción HTML5 no esta disponible en su navegador.");
		}
	}
}