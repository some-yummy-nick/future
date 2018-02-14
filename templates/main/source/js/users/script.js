//Доступный hamburger https://foxland.fi/simple-accessible-svg-menu-hamburger-animation
function hamburger(element, menu) {
	var button = document.getElementById(element),
		menu = document.getElementById(menu);
	button.onclick = function () {
		// Toggle class "opened". Set also aria-expanded to true or false.
		if (-1 !== button.className.indexOf('opened')) {
			button.className = button.className.replace(' opened', '');
			button.setAttribute('aria-expanded', 'false');
			menu.className = menu.className.replace(' active', '');
			menu.setAttribute('aria-expanded', 'false');
		} else {
			button.className += ' opened';
			button.setAttribute('aria-expanded', 'true');
			menu.className += ' active';
			menu.setAttribute('aria-expanded', 'true');
		}
	};
}

$(document).ready(function () {

	window.globalPopup = new Popup();

	// $(".js-combox").combox({
	// 	startFn: function(li, index, combox) {

	// 		this.input = combox.getElementsByTagName("input")[0];

	// 		this.input.value = li.getAttribute("value");

	// 	},
	// 	changeFn: function(li, index, combox) {

	// 		var _this = this;

	// 		this.input.value = li.getAttribute("value");

	// 	}
	// });

	$(document).on('click', '[data-ajax]', function (e) {
		e.stopPropagation();
		e.preventDefault();
		$.get(this.getAttribute('data-url'), function (response) {
			globalPopup.html(response).show();
		});
	});

	hamburger('js-hamburger', "js-menu");

	$("[type=tel]").mask("+7 (999) 999-99-99");

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