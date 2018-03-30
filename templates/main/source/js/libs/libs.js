function combox(selector) {

	var titles = document.querySelectorAll(selector);

	if (!titles.length) {
		return false;
	}

	$(titles).each(function () {

		var inputs = $(this).parent().find('input');
		var title = this;

		$(inputs).each(function () {

			if (this.checked) {
				this.parentNode.parentNode.classList.add('active');
				title.innerHTML = this.nextElementSibling.innerHTML;
				if (!this.getAttribute('data-default')) {
					title.classList.add('selected');
				}
			}

			this.addEventListener('change', function () {
				title.classList.remove('selected');
				$(inputs).each(function () {
					this.parentNode.parentNode.classList.remove('active');

					if (this.checked) {
						if (!this.getAttribute('data-default')) {
							title.classList.add('selected');
						}
					}
				})
				this.parentNode.parentNode.classList.add('active');

				title.innerHTML = this.nextElementSibling.innerHTML;

			});

		});

		this.addEventListener('click', function (e) {

			var _this = this;

			e.stopPropagation();

			$(titles).each(function () {
				if (this !== _this) {
					this.parentNode.parentNode.classList.remove('active');
				}
			});

			this.parentNode.parentNode.classList.toggle('active');
		});

	});

	document.addEventListener('click', function () {
		$(titles).each(function () {
			this.parentNode.parentNode.classList.remove('active');
		});
	});


};