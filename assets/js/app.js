$(window).scroll(animateNumbers);
var viewed = false;
var width = $(window).width();

var documentHasScroll = function() {
    return window.innerHeight <= document.body.offsetHeight;
};

window.addEventListener('scroll', function (e) {
    var headernavbar = document.getElementById("headernavbar");
    var logo = document.getElementById("navbar-brand");
    if (window.scrollY > headernavbar.offsetHeight){
        var headerNavbarNav = document.querySelector('#headerNavbarNav')
        headernavbar.classList.add('scrolled');
        logo.classList.add('scrolled');
    }else{
        headernavbar.classList.remove('scrolled');
        logo.classList.remove('scrolled');
    }
});


$(document).ready(function() {
    // $("nav").removeClass("no-transition");
	/* MENU */
	$('.navbar-nav').attr('id', 'menu'); // please don't remove this line
	$( '<div class="calendar-top"></div>' ).insertBefore( "#calendar" );
	$( '<div class="card-profile-top"></div>' ).insertBefore( ".card.profile.card-profile" );
	var divs = $(".card-profiles > div");
	for(var i = 0; i < divs.length; i+=2) {
		divs.slice(i, i+2).wrapAll( '<div class="col-xs" />');
	}

	var headerNavbar = $('#headerNavbar');
	var width100 = $('.width100');
	var innerWidth = $('body').innerWidth();
	headerNavbar.width(innerWidth);
	width100.width(innerWidth);

    $('.nav-item').children("a").each(function(){
        if($(this).attr('data-toggle') == 'dropdown'){
            $(this).removeAttr('data-toggle')
        }
    });

    $("nav").removeClass("no-transition");

    if (width < 1200) { // mobile
        $('#menuToggle input[type="checkbox"]').change(function(){
            var checked = $(this).is(":checked");
            if(checked){
                $('#menu').show("slide", { direction: "right" }, 400);
                $('#search').hide();
                $('#menu, #menu *').css({
                    'visibility': 'visible'
                });
                $('body', 'html').css({
                    'overflow': 'hidden'
                });
            }else{
                $('#menu').hide("slide", { direction: "right" }, 400);
                $('#search').hide();
                $('body', 'html').css({
                    'overflow': 'auto'
                });
            }
        });
    }

    if (window.location.hash) {
        var link = window.location.hash;
        var anchorId = link.substr(link.indexOf("#") + 1);
        if($("#"+anchorId).offset()){
            $('html, body').animate({
                scrollTop: $("#"+anchorId).offset().top - 150
            }, 500);
        }else{
            $('.accordion-border').each(function(){
                var title = $(this).find(".accordion-toggle .col-xs.start-xs").text().toUpperCase();
                var toggler = $(this).find(".accordion-toggle");
                if ( title.indexOf(anchorId.toUpperCase()) >= 0 && !toggler.next(".accordion-content").is(':visible') ){
                    $('html, body').animate({
                        scrollTop: toggler.parent().offset().top - 150
                    }, 500);
                    toggler.trigger( "click" );
                }
            });
        }
    }

    $('.dropdown a').click(function(event) {

        if (location.href.indexOf("#") != -1) {
            var link = $(this).attr('href');
            var anchorId = link.substr(link.indexOf("#") + 1);
            if($("#"+anchorId).length>0){
                $('html, body').animate({
                    scrollTop: $("#"+anchorId).offset().top - 150
                }, 500);
            }else{
                // event.preventDefault();
                $("path[title='"+anchorId.toUpperCase()+"']").addClass('active_path');

                $('.accordion-border').each(function(){
                    var title = $(this).find(".accordion-toggle .col-xs.start-xs").text().toUpperCase();
                    var toggler = $(this).find(".accordion-toggle");
                    if ( title.indexOf(anchorId.toUpperCase()) >= 0 && !toggler.next(".accordion-content").is(':visible') ){
                        $('html, body').animate({
                            scrollTop: toggler.parent().offset().top - 150
                        }, 500);
                        toggler.trigger( "click" );
                        event.preventDefault();
                    }
                });
            }
        }


    });

    $('.work_packages h2.underline').hide();

    $('body').on('click', '.partners_list .accordion-toggle, .partners-insider .accordion-toggle', function () {
        $('.ui-accordion-header').show();
        if ($(this).next(".accordion-content").is(':visible')) {
            $(this).next(".accordion-content").slideUp(300);
            if($(this).children().length == 2){
                $(this).children(".plusminus").html('<span class="plus"></span>');
            }else{
                $(this).children(".plusminus").html('<span>Show members</span><span class="plus"></span>');
            }

        } else {
            $(this).next(".accordion-content").slideDown(300);
            if($(this).children().length == 2){
                $(this).children(".plusminus").html('<span class="minus"></span>');
            }else{
                $(this).children(".plusminus").html('<span>Hide members</span><span class="minus"></span>');
            }
        }
    });

    $('body').on('click', '.work_packages .accordion-toggle', function () {
        $('.ui-accordion-header').show();
        if ($(this).next(".accordion-content").is(':visible')) {
            $(this).next(".accordion-content").slideUp(300);
                $(this).children(".plusminus").html('<span class="plus"></span>');

        } else {
            $(this).next(".accordion-content").slideDown(300);
                $(this).children(".plusminus").html('<span class="minus"></span>');

        }
    });



    $('.work_packages .accordion-content, .partners_list .accordion-toggle, .messages .accordion-toggle').each(function( index, value ) {
        $(value).find('a').attr( "onclick", "window.open(this.href, '_blank');" )
    });


	onHashChange();
	$(window).on("hashchange", function() {
		onHashChange();
	});

	$('.nav.nav-pills').removeAttr('id');

	var count = $("h1").text().length;

    console.log($(location.hash));

	$('.tabs:not(#mylibraryForm)').each(function(){
		// For each set of tabs, we want to keep track of
		// which tab is active and its associated content
		var $active, $content, $links = $(this).find('a');
		var speed = "fast";

		var activeTab = $(location.hash);
		// If the location.hash matches one of the links, use that as the active tab.
		// If no match is found, use the first link as the initial active tab.
		$active = $($links.filter("[href=\'"+location.hash+"\']")[0] || $links[0]);

        if(!$(this).parent().parent().hasClass('library')){
            $active.addClass('active');
        }

		$content = $($active[0].hash);

		// Hide the remaining content
		$links.not($active).each(function () {
			$(this.hash).hide();
		});

		if(activeTab.length){
			$content.slideDown(speed);
			//scroll to element
			$('html, body').animate({
				scrollTop:  activeTab.offset().top - $('header').height()
			}, speed);
		}

		// Bind the click event handler
		$(this).find("a").click(function (e) {
			if($(this).hasClass('active')) {
				$content.slideDown({
					scrollTop: $content.offset().top - $('header').height()
				}, speed);
				var screenSize = getScreenSize();
				if (screenSize.width < 800) {
					// scroll to element
					$('html, body').animate({
						scrollTop: $content.offset().top - $('header').height() + 300  // mobile
					}, speed);
				}else{
					//scroll to element icons top
					$('html, body').animate({
						scrollTop:  $content.offset().top - $('header').height() + 300
					}, speed);
				}
				e.preventDefault();
				return false;
			}
			// Make the old tab inactive.
			$active.removeClass('active');
			// $content.slideUp({
			// 	scrollTop: $content.offset().top - $('header').height() - $('.left_sidebar').height()
			// }, speed);
			$content.hide();

			// Update the variables with the new link and content
			$active = $(this);
			$content = $(this.hash);

			location.hash = $active[0].hash;

			// Make the tab active.
			$active.addClass('active');
			$content.slideDown({
				scrollTop: $content.offset().top - $('header').height()
			}, speed);
			// var screenSize = getScreenSize();
			// if (screenSize.width < 800) {
			// 	// scroll to element
			// 	$('html, body').animate({
			// 		scrollTop: $content.offset().top - $('header').height() + 300 // mobile
			// 	}, speed);
			// }else{
			// 	//scroll to element icons top
			// 	$('html, body').animate({
			// 		scrollTop:  $content.offset().top - $('header').height() + 300
			// 	}, speed);
			// }

			// Prevent the anchor\'s default click action
			e.preventDefault();
		});
	});



	$('.numbers').attr('data-aos', 'fade-up');
	$('.mission .container').attr('data-aos', 'fade-right');
	$('.vision .container').attr('data-aos', 'fade-right');
	$('.card-img-top').attr('data-aos', 'fade-up');
	$('.logo-container').attr('data-aos', 'fade-up');
	$('.subscribe-items a').attr('data-aos', 'fade-up');
	// $('.icons a').attr('data-aos', 'fade-up');
	$('.about h1.display-1').attr('data-aos', 'fade-up');
	$('h2.underline').attr('data-aos', 'fade-up');
	$('.news_column').attr('data-aos', 'fade-up');
	// $('.timeline-item').attr('data-aos', 'fade-up');

	// about page

	$('.about img').attr('data-aos', 'fade-up');

	$('.country_map').attr('data-aos', 'fade-up');
	$('.partner-item').attr('data-aos', 'fade-up');

	// media
	$('.flyer_image_container img').attr('data-aos', 'fade-up');
	$('.broshure_and_poster img').attr('data-aos', 'fade-up');
	$('.card-container').attr('data-aos', 'fade-up');
	$('.coordinator_image').attr('data-aos', 'fade-up');


	// $('.news_column, .single-news-item').each(function(){
	$('.news_column').each(function(){
		$(this).find('img').wrapAll("<div class='shadow'></div>")
	});

	$('.news .news-container, .news .news-image').removeClass('col-xs-12').removeClass('center-xs');

	$('.partners .partner_description, .partners .list-item-body').each(function(){
		var countParagraphs = $(this).find('p').length;
		if(countParagraphs > 1) {
			$(this).find('p').first().append('<div class="dorsal">Read more</div>');
			$(this).find('p:not(:first)').wrapAll("<div class='toogle-contact-paragraphs'></div>")
		}
	});

	$('.dorsal').click(function () {
		var link = $(this);
		link.parent().parent().find('.toogle-contact-paragraphs').slideToggle('slow', function() {
			if ($(this).is(':visible')) {
				link.text('Read less');
			} else {
				link.text('Read more');
			}
		});

	});

	$('.see_all_partners_link').hide();

    if (width >= 1024) {
        $('.partners_list .key_1, .partners_list .key_3, .partners_list .key_5, .partners_list .key_7, .partners_list .key_9, .partners_list .key_11, .partners_list .key_13').wrapAll('<div class="col-md-6 col-xs-12" />');
        $('.partners_list .key_0, .partners_list .key_2, .partners_list .key_4, .partners_list .key_6, .partners_list .key_8, .partners_list .key_10, .partners_list .key_12').wrapAll('<div class="col-md-6 col-xs-12" />');
    }

    $('.library-item .btn.btn-primary').html('Download <i></i>');


});

function handleTreeSVGMapMouseMove(event) {
    var title = $(event.target).parent().attr('title');
    var desc = $(event.target).parent().attr('desc');
    var tooltip = document.getElementById("tooltip");

    if (typeof title  == "undefined"){
        return tooltip.classList.remove("active");
    }
    var x = event.clientX;
    var y = event.clientY;

    tooltip.style.left = (x - 250) + "px";
    tooltip.style.top = (y - 20) + "px";

    tooltip.innerHTML = '<div class="tooltip_flag_container"><h4>' + title + '</h4><p>' + desc + '</p></div>';
    tooltip.classList.add("active");

}

function handleToolSVGMapMouseMove(event) {
    var title = $(event.target).parent().attr('title');
    var desc = $(event.target).parent().attr('desc');
    var tooltip = document.getElementById("tooltip");

    if (typeof title  == "undefined"){
        return tooltip.classList.remove("active");
    }
    var x = event.clientX;
    var y = event.clientY;

    tooltip.style.left = (x - 250) + "px";
    tooltip.style.top = (y - 20) + "px";

    tooltip.innerHTML = '<div class="tooltip_flag_container"><h4>' + title + '</h4><p>' + desc + '</p></div>';
    tooltip.classList.add("active");

}

function onHashChange(){
	$("path").removeClass('active_path');
	$(".accordion-content").hide();
	var caseStudiesHashTitle = location.hash;

	if(caseStudiesHashTitle){
		var caseStudiesTitle = caseStudiesHashTitle.substring(1, caseStudiesHashTitle.length);
		$("path[title='"+caseStudiesTitle.toUpperCase()+"']").addClass('active_path');

		$('.pilots .accordion-border').each(function(){
			var title = $(this).find(".accordion-toggle .col-xs.start-xs").text().toUpperCase();
			var toggler = $(this).find(".accordion-toggle");
			if ( title.indexOf(caseStudiesTitle.toUpperCase()) >= 0 && !toggler.next(".accordion-content").is(':visible') ){
				toggler.trigger( "click" );
			}
		});
	}
}


function createTippy(element, options) {
	return new Promise(resolve => {
		tippy(element, Object.assign({}, {
			allowHTML: true,
			interactive: true,
			animation: 'scale',
			theme: 'light',
		}, options));
		resolve();
	});
}



function encodeURIObject(data){
    return Object.keys(data).map(function (i) {
        return encodeURIComponent(i) + '=' + encodeURIComponent(data[i])
    }).join('&');
}

function appendProfile() {
    $(document).on('profile', function (e) {
        var headerNavbarNav = $('#headerNavbarNav');
        var li = '<li class="nav-item"><a href="/profile" target = "_self">Profile</a></li >';
        headerNavbarNav.find('>ul').append(li);
    });
}
function appendSignIn(){
    $(document).on('signin', function (e) {
        var headerNavbarLogin = $('#headerNavbarNav');
        var li = '<li class="nav-item sign-in"><a href="/login" target = "_self">Login</a></li >';
		headerNavbarLogin.find('>ul').append(li);
		var menu = $('#menuToggle');
		menu.find('>ul').append(li);
    });
}

function appendSignOut() {
    $(document).on('signout', function (e) {
        var headerNavbarNav = $('#headerNavbarNav');
        var li = '<li class="nav-item  sign-in"><a data-request="onLogout" data-request-data="redirect: \'/\'">Logout</a></li >';
        headerNavbarNav.find('>ul').append(li);
		var menu = $('#menuToggle');
		menu.find('>ul').append(li);
    });
}

function appendSearchAndSocialMedia(){
	var liSearch = '<li class="nav-item search_field"><a href=\"javascript: void(0);\" onclick=\"showSearchForm();\" class="pr p-search medium"></a></li>';
	var liSocial = '<li class="nav-item social">' +
        '<a href=\"https://twitter.com/TRANSPATH_EU\" target=\"_blank\" class=\"pr p-twitter medium\" target=\"_blank\"></a>' +
        '<a href=\"https://www.linkedin.com/company/transpath-project/\" target=\"_blank\" class=\"pr p-linkedin medium\" target=\"_blank\"></a></li>';
	var menu = $('#menuToggle');
	menu.find('>ul').append(liSearch).append(liSocial);
}

function redirectAndRefresh(url){
	$(".tabs a").each(function() {
		this.href = window.location.hash;
	});
	window.open(url, '_blank');
	location.reload();
}

function isBreakpointLarge() {
    return window.innerWidth <= 991;
}

function showSearchForm(){
	// if ($(".search").is(':visible')) {
	// 	$('#menu').show();
	// } else {
	// 	$(".search").slideDown(300);
	// 	$('#menu').hide();
	// }
	// $('#menu').hide();
	$('#layout-header').toggleClass('full-width');
	$('#search').toggle();
	$('#menu li').hide();
	$('nav a:not(.navbar-brand)').hide();
}

function hideSearchForm(){
	$('#layout-header').toggleClass('full-width');
	$('#search').hide();
	$('#menu li').show();
    $('nav a').show();
}

function requestFormLibrary() {
	$('#mylibraryForm').on('click', 'a', function () {
		var $form = $(this).closest('form');
		$form.request();
	})
}

function requestFormPartners() {
	$('#myPartnersForm').on('click', 'a', function () {
		var $form = $(this).closest('form');
		$form.request();
	})
}

function isScrolledIntoView(elem) {
	var docViewTop = $(window).scrollTop();
	var docViewBottom = docViewTop + $(window).height();

	if($(elem).height()){
		var elemTop = $(elem).offset().top;
		var elemBottom = elemTop + $(elem).height();

		return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
	}
	return;

}


function animateNumbers() {
	if (isScrolledIntoView($(".numbers")) && !viewed) {
		viewed = true;
		$('.count').each(function () {
			var size = $(this).text().split(".")[1] ? $(this).text().split(".")[1].length : 0;
			$(this).prop('Counter',0).animate({
				Counter: $(this).text()
			}, {
				duration: 1800,
				easing: 'swing',
				step: function (now) {
					$(this).text(parseFloat(now).toFixed(size));
				}
			});
		});
	}
}


function scrollDown(){
	var element = $('#layout-content');
	$("html, body").animate({ scrollTop: element.offset().top - 190 }, 500);
}


function handleCustomSVGMapMouseMove(event) {
    var countryCode = $(event.target).attr('country_code');
    var title = $(event.target).attr('title');
    var tooltip = document.getElementById("tooltip");
    if (!countryCode) {
        countryCode = $(event.target).parent().attr('country_code');
        title = $(event.target).parent().attr('title');
    }

    switch (countryCode) {
        case "AF":
        case "AX":
        case "AL":
        case "DZ":
        case "AS":
        case "AD":
        case "AO":
        case "AI":
        case "AQ":
        case "AG":
        case "AR":
        case "AM":
        case "AW":
        case "AT":
        case "AZ":
        case "BS":
        case "BH":
        case "BD":
        case "BB":
        case "BY":
        case "BE":
        case "BZ":
        case "BJ":
        case "BM":
        case "BT":
        case "BO":
        case "BQ":
        case "BA":
        case "BW":
        case "BV":
        case "BR":
        case "IO":
        case "BN":
        case "BG":
        case "BF":
        case "BI":
        case "KH":
        case "CM":
        case "CV":
        case "KY":
        case "CF":
        case "TD":
        case "CL":
        case "CN":
        case "CX":
        case "CC":
        case "CO":
        case "KM":
        case "CG":
        case "CD":
        case "CK":
        case "CR":
        case "CI":
        case "HR":
        case "CU":
        case "CW":
        case "CY":
        case "CZ":
        case "DK":
        case "DJ":
        case "DM":
        case "DO":
        case "EC":
        case "EG":
        case "SV":
        case "GQ":
        case "ER":
        case "EE":
        case "ET":
        case "FK":
        case "FO":
        case "FI":
        case "FJ":
        case "GF":
        case "PF":
        case "TF":
        case "GA":
        case "GM":
        case "GE":
        case "GH":
        case "GI":
        case "GR":
        case "GL":
        case "GD":
        case "GP":
        case "GU":
        case "GT":
        case "GG":
        case "GN":
        case "GW":
        case "GY":
        case "HT":
        case "HM":
        case "VA":
        case "HN":
        case "HK":
        case "IS":
        case "ID":
        case "IR":
        case "IQ":
        case "IM":
        case "IL":
        case "IT":
        case "JM":
        case "JP":
        case "JE":
        case "JO":
        case "KZ":
        case "KE":
        case "KI":
        case "KP":
        case "KR":
        case "KW":
        case "KG":
        case "LA":
        case "LV":
        case "LB":
        case "LS":
        case "LR":
        case "LY":
        case "LI":
        case "LT":
        case "LU":
        case "MO":
        case "MK":
        case "MG":
        case "MW":
        case "MY":
        case "MV":
        case "ML":
        case "MT":
        case "MH":
        case "MQ":
        case "MR":
        case "MU":
        case "YT":
        case "MX":
        case "FM":
        case "MD":
        case "MC":
        case "MN":
        case "ME":
        case "MS":
        case "MA":
        case "MZ":
        case "MM":
        case "NA":
        case "NR":
        case "NP":
        case "NC":
        case "FR":
        case "IN":
        case "NL":
        case "HU":
        case "IE":
        case "CA":
        case "NZ":
        case "DE":
        case "NI":
        case "NE":
        case "NG":
        case "NU":
        case "NF":
        case "MP":
        case "NO":
        case "OM":
        case "PK":
        case "PW":
        case "PS":
        case "PA":
        case "PG":
        case "PY":
        case "PE":
        case "PH":
        case "PN":
        case "PT":
        case "PR":
        case "QA":
        case "RE":
        case "RU":
        case "RW":
        case "BL":
        case "SH":
        case "KN":
        case "LC":
        case "MF":
        case "PM":
        case "VC":
        case "WS":
        case "SM":
        case "ST":
        case "SA":
        case "SN":
        case "RS":
        case "SC":
        case "SL":
        case "SG":
        case "SX":
        case "SK":
        case "SI":
        case "SB":
        case "SO":
        case "ZA":
        case "GS":
        case "LK":
        case "SD":
        case "SR":
        case "SJ":
        case "SZ":
        case "SE":
        case "SY":
        case "TW":
        case "TJ":
        case "TZ":
        case "TH":
        case "TL":
        case "TG":
        case "TK":
        case "TO":
        case "TT":
        case "TN":
        case "TR":
        case "TM":
        case "TC":
        case "TV":
        case "UG":
        case "UA":
        case "AE":
        case "UM":
        case "UY":
        case "UZ":
        case "VU":
        case "VE":
        case "VN":
        case "VG":
        case "VI":
        case "WF":
        case "EH":
        case "YE":
        case "ZM":
        case "ZW":
        case "US":
        case "GB":
        case "ES":
        case "AU":
        case "RO":
        case "CH":
        case "PL":
            break;
        default:
            return tooltip.classList.remove("active");
    }

    var x = event.clientX;
    var y = event.clientY;

    tooltip.style.left = (x + 20) + "px";
    tooltip.style.top = (y - 20) + "px";

    tooltip.innerHTML = title;
    tooltip.classList.add("active");

}


function onCustomPartners(code) {
		$('.partner-item').removeClass('active_partner');
		$.request('onPartners', {
			update: { 'components/partners_list': '#mycomponentpartners',
			},
			data: {
                code: code
			},
		}).then(response => {
            $('html, body').animate({
                scrollTop: $("#mycomponentpartners").offset().top - 200
            }, 1000);
            var tooltip = document.getElementById("tooltip");
            tooltip.classList.remove("active");

            if (width >= 1024) {
                $('.key_1, .key_3, .key_5, .key_7, .key_9, .key_11, .key_13').wrapAll('<div class="col-md-6 col-xs-12" />');
                $('.key_0, .key_2, .key_4, .key_6, .key_8, .key_10, .key_12').wrapAll('<div class="col-md-6 col-xs-12" />');
            }
		});
}


function onCustomSinglePartner(pId) {
    $.request('onSinglePartner', {
        update: { 'components/partners_list': '#mycomponentpartners',
        },
        data: {
            partner_id: pId
        },
    }).then(response => {
        $('html, body').animate({
            scrollTop: $("#mycomponentpartners").offset().top - 200
        }, 1000);
        var tooltip = document.getElementById("tooltip");
        tooltip.classList.remove("active");
    });
}


function handleStepsModal(){
    const selected = document.querySelector('input[name="role_type"]:checked');
    if (!selected) {
        alert('Please select an option');
        return;
    }

    const value = selected.value;
    document.getElementById('selectedType').textContent = value.charAt(0).toUpperCase() + value.slice(1);

    oc.request(this, 'onLoadPartial', {
        data: { type: value },
        update: { 'modal-content': '#modalContent' },
        success: function() {
            new bootstrap.Modal(document.getElementById('userModal')).show();
        }
    });
}

function init() {
    window.addEventListener('resize', function () {
        if (isBreakpointLarge()) {
            $('#card-carousel').slick('unslick');
        } else {
            if (typeof cardCarousel === 'function') {
                cardCarousel({
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    autoplay: true,
                    autoplaySpeed: 6000,
                    prevArrow: '<i class="slick-prev pr p-back"/>',
                    nextArrow: '<i class="slick-next pr p-forward"/>',
                });
             }
        }
        // keepFooter(documentHasScroll());

    });
    document.addEventListener('DOMContentLoaded', function () {
        if (!isBreakpointLarge()) {
            if (typeof cardCarousel === 'function') {
                cardCarousel({
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    autoplay: true,
                    autoplaySpeed: 6000,
                    prevArrow: '<i class="slick-prev pr p-back"/>',
                    nextArrow: '<i class="slick-next pr p-forward"/>',
                });
            }
        }
		appendSearchAndSocialMedia()
		requestFormLibrary()
		// requestFormPartners()
        // keepFooter(documentHasScroll());

    });
    // appendProfile()
    // appendSignIn()
    // appendSignOut()
}

init()
