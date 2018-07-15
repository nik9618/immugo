var params;

var templates = {
	empty: chrome.extension.getURL('template/empty.html'),
}

var images = {
	poweredByImmugo: chrome.extension.getURL('images/powered-by.png'),
	planeBg: chrome.extension.getURL('images/plane-bg.png'),
	healthTips: {
		th: chrome.extension.getURL('images/health-tips-th.png')
	},
	flightDescription: {
		bangkok: chrome.extension.getURL('images/flight-bangkok.png'),
		kabul: chrome.extension.getURL('images/flight-kabul.png'),
		lagos: chrome.extension.getURL('images/flight-lagos.png')
	},
	kayakHeader: chrome.extension.getURL('images/kayak-header.png'),
	kayakFooter: chrome.extension.getURL('images/kayak-footer.png'),
	syringe: chrome.extension.getURL('images/syringe.png'),
	infoico: chrome.extension.getURL('images/info.png'),
	ok: chrome.extension.getURL('images/ok.png')
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
			params = {
				'route': $('.Checkout-Flight-Book-Main-FlightOverview h2').html(),
				'overview': $('.Checkout-Flight-Book-Main-FlightOverview').find('p').html(),
			}
			// if they click this button go to main page...
			// $('#bookButton').parent().click(function() {launchMainPage(params);});
			launchMainPage();
			// launchProviderListPage(params)
		}
	}, 100);
}

function openVideo(type) {
	var iframe = {}
	iframe['typhoid'] = '<iframe width="400" height="300" src="https://www.powtoon.com/embed/dZdBrISu3dk/" frameborder="0"></iframe>';
	iframe['hepa'] = '<iframe width="400" height="300" src="https://www.powtoon.com/embed/goPXptmcVeL/" frameborder="0"></iframe>';
	iframe['polio'] = '<iframe width="400" height="300" src="https://www.powtoon.com/embed/gpaYVObOXgE/" frameborder="0"></iframe>';
	$('.video-container').html(iframe[type]);	
	$('.video-container').show();
}

function changeStateButton(e) {
	var elemid = '#'+e.target.id;
	if ($('#'+e.target.id).hasClass('selected')) {
		$('#'+e.target.id).removeClass('selected');
		$('#'+e.target.id + ' img').removeClass('selected');
		$('#'+e.target.id + ' span').removeClass('selected');
	} else {
		$('#'+e.target.id).addClass('selected');
		$('#'+e.target.id + ' img').addClass('selected');
		$('#'+e.target.id + ' span').addClass('selected');
	}
	makeTheVaccineListCorrect();
}

function makeTheVaccineListCorrect() {
	$('#hepa').hide();
	$('#typhoid').hide();
	$('#hepa-withkid').hide();
	$('#typhoid-withkid').hide();
	$('#polio').hide();
	$('#malaria').hide();
	$('#yellow-fewer').hide();

	var btn1 = $('#btn-1').hasClass('selected')
	var btn2 = $('#btn-2').hasClass('selected')
	var btn3 = $('#btn-3').hasClass('selected')
	var btn4 = $('#btn-4').hasClass('selected')
	var btn5 = $('#btn-5').hasClass('selected')
	var btn6 = $('#btn-6').hasClass('selected')
	var btn7 = $('#btn-7').hasClass('selected')
	
	var total = 0;
	if (!btn1) {
		$('#hepa').show();
		$('#typhoid').show();
		total += 80;
	}

	if (btn1) {
		$('#hepa-withkid').show();
		$('#typhoid-withkid').show();
		total += 80;
	}

	// afghanistan
	if (params.route.indexOf("Kabul") != -1) {
		$('#polio').show();
		total += 40;
	}
	
	//nigria
	if (params.route.indexOf("Lagos") != -1) {
		$('#polio').show();
		$('#malaria').show();
		$('#yellow-fewer').show();
		total += 120;
	}

	$('.price').html("As low as $" + total);
}

function launchMainPage() {
	$.get(chrome.extension.getURL('template/main.html'), function(data) {
		$('.col-main').empty();
	    $('.col-rr').empty();
	    $('.Checkout-Common-Title-BannerTitle h1').html("Trip > Booking receipts > KUSW-292905");

		$($.parseHTML(data)).appendTo('.col-main');
			
		if (params.route.indexOf("Kabul") != -1) {
			$('#flight-description').attr('src', images.flightDescription.kabul);	
		} else if (params.route.indexOf("Lagos") != -1) {
			$('#flight-description').attr('src', images.flightDescription.lagos);	
		} else {
			$('#flight-description').attr('src', images.flightDescription.bangkok);	
		}

		$('#stay-well').attr('src', images.healthTips.th);
		$('.syringe').attr('src', images.syringe);
		$('.ok').attr('src', images.ok);
		$('.info-ico').attr('src', images.infoico);
		$('.condition').click(changeStateButton);
		makeTheVaccineListCorrect();
		$('.health-tips').append(createSectionHeader('Stay well during your trip to Thailand'));
		$('.next-button').click(function() {
			launchProviderListPage({});
		});

		$('.info-ico.typhoid').click(function() {openVideo('typhoid');});
		$('.info-ico.polio').click(function() {openVideo('polio');});
		$('.info-ico.hepa').click(function() {openVideo('hepa');});
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
