//Доступный hamburger https://foxland.fi/simple-accessible-svg-menu-hamburger-animation
function hamburger(element, menu) {
	var button = document.getElementById(element),
		menu = document.getElementById(menu),
		wrap = document.querySelector(".js-wrap");
	button.onclick = function () {
		// Toggle class "opened". Set also aria-expanded to true or false.
		if (-1 !== button.className.indexOf('opened')) {
			button.className = button.className.replace(' opened', '');
			button.setAttribute('aria-expanded', 'false');
			menu.className = menu.className.replace(' active', '');
			wrap.className = wrap.className.replace(' active', '');
			menu.setAttribute('aria-expanded', 'false');
		} else {
			button.className += ' opened';
			button.setAttribute('aria-expanded', 'true');
			menu.className += ' active';
			wrap.className += ' active';
			menu.setAttribute('aria-expanded', 'true');
		}
	};
}

$(document).ready(function () {

	window.globalPopup = new Popup();

	combox('.js-combox__title');

	hamburger('js-hamburger', "js-menu");

	$("[type=tel]").mask("+7 (999) 999-99-99");

	var swiperWhy = new Swiper('.js-swiper-why', {
		slidesPerView: 2.2,
		loop: true,
		initialSlide: 1,
		loopedSlides: 3000,
		loopAdditionalSlides: 3,
		loopFillGroupWithBlank: 3,
		centeredSlides: true,
		navigation: {
			nextEl: '.swiper_why-next',
			prevEl: '.swiper_why-prev',
		},
		pagination: {
			el: '.swiper-pagination',
			clickable: true
		},
		breakpoints: {
			1160: {
				slidesPerView: 1
			}
		}

	});

	(function () {
		var inputs = document.querySelectorAll('.js-file');
		var result = document.querySelector(".js-result");

		Array.prototype.forEach.call(inputs, function (input) {

			input.addEventListener('change', function (e) {
				if (input.files && input.files[0]) {

					var reader = new FileReader();
					for (let i = 0; i < input.files.length; i++) {
						var file = input.files[0];
					}

				}
			});
		});
	})();

	// Прибивка адаптивного футера к низу
	(function (footerSelector, wrapperSelector) {

		var footer = document.querySelector(footerSelector);
		var wrapper = document.querySelector(wrapperSelector);
		var height;
		var setSize;

		if (!wrapper || !footer) {
			return false;
		}

		setSize = function () {

			height = footer.offsetHeight;

			wrapper.style.paddingBottom = height + 'px';
			footer.style.marginTop = (height * (-1)) + 'px';

		}

		setSize();

		window.addEventListener('resize', setSize, false);

	})('#js-footer', '#js-wrapper');

});