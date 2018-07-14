// 0 = initial from kayak
// 1 = after click book -> recommendation page.
var state = 0;

chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);
		overrideBookButton();	
	}
	}, 100);
});

function overrideBookButton() {
	var timer = setInterval(function(){ 
		// loop until the button is ready.
		if ($('#bookButton').length == 1) {
			clearInterval(timer);
			var params = {
				'route': $('.Checkout-Flight-Book-Main-FlightOverview h2').html(),
				'overview': $('.Checkout-Flight-Book-Main-FlightOverview').find('p').html(),
			}
			// if they click this button go to main page...
			// $('#bookButton').parent().click(function() {launchMainPage(params);});
			launchMainPage(params)
		}
	}, 100);
}

function launchMainPage(params) {
	$.get(chrome.extension.getURL('template/main.html'), function(data) {
		$('.col-main').empty();
	    $('.col-rr').empty();
	    $('.Checkout-Common-Title-BannerTitle h1').html("Trip > Booking receipts > KUSW-292905");
		$($.parseHTML(data)).appendTo('.col-main');
		$('#flight-description').attr('src', chrome.extension.getURL('template/flight-detail.png'));
		$('#stay-well').attr('src', chrome.extension.getURL('template/stay-well.png'));
	});
}
