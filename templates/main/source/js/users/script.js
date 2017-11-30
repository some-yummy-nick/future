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

	// $(".js-catalog-tumb").setEqualHeight();
	// $(".js-catalog-mosaic__photo").setEqualHeight();
	// $('#js-catalog-list-popular').setEqualHeight({itemsSel: '.js-equal-height-photo', itemsInLineCount: 4});

	$(document).on('click', '[data-ajax]', function(e) {
		e.stopPropagation();
		e.preventDefault();
		$.get(this.getAttribute('data-url'), function(response) {
			globalPopup.html(response).show();
		});
	});

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