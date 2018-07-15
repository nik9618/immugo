// 0 = initial from kayak
// 1 = after click book -> recommendation page.
var state = 0;

var templates = {
	empty: chrome.extension.getURL('template/empty.html'),
}

var images = {
	poweredByImmugo: chrome.extension.getURL('images/powered-by.png'),
	planeBg: chrome.extension.getURL('images/plane-bg.png'),
	healthTips: {
		th: chrome.extension.getURL('images/health-tips-th.png')
	},
	kayakHeader: chrome.extension.getURL('images/kayak-header.png'),
	kayakFooter: chrome.extension.getURL('images/kayak-footer.png')
}

var providers = [
	{
		name: 'Passport Health Downtown San Francisco Travel Clinic',
		address: '47 Kearny St STE 701, San Francisco, CA 94108',
		link: 'https://www.passporthealthusa.com/schedule-appointment/?satid=880'
	},
	{
		name: 'AITC Immunization Travel Clinic',
		address: '101 Grove St, San Francisco, CA 94102',
		link: 'https://www.passporthealthusa.com/schedule-appointment/?satid=789'
	},
	{
		name: 'Travel Clinic: California Pacific Medical Center',
		address: '3801 Sacramento St, San Francisco, CA 94118',
		link: 'http://www.cpmc.org/services/travel/?utm_medium=local&utm_source=google_plus-local&utm_campaign=local-San-Francisco-CPMC-3'
	}
]

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
			// launchProviderListPage(params)
		}
	}, 100);
}

function launchMainPage(params) {
	$.get(chrome.extension.getURL('template/main.html'), function(data) {
		$('.col-main').empty();
	    $('.col-rr').empty();
	    $('.Checkout-Common-Title-BannerTitle h1').html("Trip > Booking receipts > KUSW-292905");
		const $immugoMain = $($.parseHTML(data))
		$immugoMain.appendTo('.col-main');

		$('.health-tips').append(createSectionHeader('Stay well during your trip to Thailand'))
		$('#flight-description').attr('src', chrome.extension.getURL('template/flight-detail.png'));
		$('#stay-well').attr('src', images.healthTips.th);
		$('.syringe').attr('src', chrome.extension.getURL('template/syringe.png'));
		$('.ok').attr('src', chrome.extension.getURL('template/ok.png'));

		$('.next-button').click(function() {
			launchProviderListPage({})
		});
	});
}

function launchProviderListPage(params) {
	$.get(templates.empty, function(data) {
		$('.col-main').empty();
	  $('.col-rr').empty();
	  $('.Checkout-Common-Title-BannerTitle h1').html("Trip > Booking receipts > KUSW-292905");
		$($.parseHTML(data)).appendTo('.col-main');
		$('.provider-list').append(createProviderListItem(providers[0]))
		$('.provider-list').append(createProviderListItem(providers[1]))
		$('.provider-list').append(createProviderListItem(providers[2]))
	});
}

function createSectionHeader(headerText) {
	var $header = $('<div></div>')
	$header.append('<img src="' + images.poweredByImmugo + '" class="immugo-powered-by" />')
	$header.append('<h2 class="immugo-section-header" style="background-image:url(\'' + images.planeBg + '\'); margin-top: 0;">' + 
										headerText + 
									'</h2>')
	return $header
}

function createTravelTipsSection() {
	
}

function createProviderListItem(data) {
	var $item = $('<li class="provider-list-item"></li>')
	var $col1 = $('<div class="immugo-col immugo-col-70"></div>')
	var $col2 = $('<div class="immugo-col immugo-col-30" style="text-align: right;"></div>')
	var $button = $('<button class="immugo-button">Details</button>')
	$button.click(function() {
		window.open(data.link)
	})
	$col1.append('<strong>' + data.name  + '</strong>')
	$col1.append('<address>' + data.address + '</address>')
	$col2.append($button)
	$item.append($col1)
	$item.append($col2)
	return $item
}
