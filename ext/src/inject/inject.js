var params;

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
		}
	}, 100);
}

function openVideo() {
	var typhoid = '<iframe width="400" height="300" src="https://www.powtoon.com/embed/dZdBrISu3dk/" frameborder="0"></iframe>';
	var hepb = '<iframe width="1280" height="720" src="https://www.powtoon.com/embed/goPXptmcVeL/" frameborder="0"></iframe>';
	var polio = '<iframe width="1280" height="720" src="https://www.powtoon.com/embed/gpaYVObOXgE/" frameborder="0"></iframe>';

	$('.video-container').html(iframe);
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
			$('#flight-description').attr('src', chrome.extension.getURL('template/flight-kabul.png'));	
		} else if (params.route.indexOf("Lagos") != -1) {
			$('#flight-description').attr('src', chrome.extension.getURL('template/flight-lagos.png'));
		} else {
			$('#flight-description').attr('src', chrome.extension.getURL('template/flight-bangkok.png'));
		}

		$('#stay-well').attr('src', chrome.extension.getURL('template/stay-well.png'));
		$('.syringe').attr('src', chrome.extension.getURL('template/syringe.png'));
		$('.ok').attr('src', chrome.extension.getURL('template/ok.png'));
		$('.info-ico').attr('src', chrome.extension.getURL('template/info.png'));
		$('.condition').click(changeStateButton);
		makeTheVaccineListCorrect();
	});
}
