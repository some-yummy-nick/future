function initMaps(opts) {

	opts = $.extend({
		map: null,
		zoom: 11,
		center: [],
		coords: [],
		popup: false,
		callback: function () { }
	}, opts);

	if (!opts.map) {
		return false;
	}

	var MyBalloonContentLayout;
	var MyBalloonLayout;
	var myPlacemark;

	var myMap = new ymaps.Map(opts.map, {
		center: opts.center,
		zoom: opts.zoom
	});

	myMap.controls
		.remove('mapTools')
		.remove('typeSelector')
		.remove('smallZoomControl')
		.remove('scaleLine')
		.remove('miniMap')
		.remove('searchControl')
		// .remove('zoomControl')
		.remove('trafficControl')
		.remove('mapTools');

	if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || screen.width < 768) {
		myMap.behaviors.disable('drag');
	}

	for (var i = 0, l = opts.coords.length; i < l; i += 1) {

		if (opts.popup) {

			MyBalloonLayout = ymaps.templateLayoutFactory.createClass(
				'<div class="map-popup">' +
				'<div class="map-popup__close">&times;</div>' +
				'<div class="map-popup__arrow"></div>' +
				'<div class="map-popup__inner">' +
				'$[[options.contentLayout observeSize minWidth=230 maxWidth=230 maxHeight=350]]' +
				'</div>' +
				'</div>', {
					/**
					 * Строит экземпляр макета на основе шаблона и добавляет его в родительский HTML-элемент.
					 * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/layout.templateBased.Base.xml#build
					 * @function
					 * @name build
					 */
					build: function () {
						this.constructor.superclass.build.call(this);

						this._$element = $('.map-popup', this.getParentElement());

						this.applyElementOffset();

						this._$element.find('.map-popup__close')
							.on('click', $.proxy(this.onCloseClick, this));
					},

					/**
					 * Удаляет содержимое макета из DOM.
					 * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/layout.templateBased.Base.xml#clear
					 * @function
					 * @name clear
					 */
					clear: function () {
						this._$element.find('.map-popup__close')
							.off('click');

						this.constructor.superclass.clear.call(this);
					},

					/**
					 * Метод будет вызван системой шаблонов АПИ при изменении размеров вложенного макета.
					 * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/IBalloonLayout.xml#event-userclose
					 * @function
					 * @name onSublayoutSizeChange
					 */
					onSublayoutSizeChange: function () {
						MyBalloonLayout.superclass.onSublayoutSizeChange.apply(this, arguments);

						if (!this._isElement(this._$element)) {
							return;
						}

						this.applyElementOffset();

						this.events.fire('shapechange');
					},

					/**
					 * Сдвигаем балун, чтобы "хвостик" указывал на точку привязки.
					 * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/IBalloonLayout.xml#event-userclose
					 * @function
					 * @name applyElementOffset
					 */
					applyElementOffset: function () {
						this._$element.css({
							left: -(this._$element[0].offsetWidth / 2),
							top: -(this._$element[0].offsetHeight + this._$element.find('.map-popup__arrow')[0].offsetHeight)
						});
					},

					/**
					 * Закрывает балун при клике на крестик, кидая событие "userclose" на макете.
					 * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/IBalloonLayout.xml#event-userclose
					 * @function
					 * @name onCloseClick
					 */
					onCloseClick: function (e) {
						e.preventDefault();

						this.events.fire('userclose');
					},

					/**
					 * Используется для автопозиционирования (balloonAutoPan).
					 * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/ILayout.xml#getClientBounds
					 * @function
					 * @name getClientBounds
					 * @returns {Number[][]} Координаты левого верхнего и правого нижнего углов шаблона относительно точки привязки.
					 */
					getShape: function () {
						if (!this._isElement(this._$element)) {
							return MyBalloonLayout.superclass.getShape.call(this);
						}

						var position = this._$element.position();

						return new ymaps.shape.Rectangle(new ymaps.geometry.pixel.Rectangle([
							[position.left, position.top - 50], [
								position.left + this._$element[0].offsetWidth,
								position.top + this._$element[0].offsetHeight + this._$element.find('.map-popup__arrow')[0].offsetHeight
							]
						]));
					},

					/**
					 * Проверяем наличие элемента (в ИЕ и Опере его еще может не быть).
					 * @function
					 * @private
					 * @name _isElement
					 * @param {jQuery} [element] Элемент.
					 * @returns {Boolean} Флаг наличия.
					 */
					_isElement: function (element) {
						return element && element[0] && element.find('.map-popup__arrow')[0];
					}
				}),

				// Создание вложенного макета содержимого балуна.
				MyBalloonContentLayout = ymaps.templateLayoutFactory.createClass(
					'<h3 class="map-popup__title">$[properties.balloonHeader]</h3>' +
					'<div class="map-popup__text">$[properties.balloonContent]</div>'
				),

				// Создание метки с пользовательским макетом балуна.
				myPlacemark = new ymaps.Placemark([opts.coords[i].x, opts.coords[i].y], {
					balloonHeader: opts.coords[i].title,
					balloonContent: opts.coords[i].content
				}, {
						balloonShadow: false,
						balloonLayout: MyBalloonLayout,
						balloonContentLayout: MyBalloonContentLayout,
						balloonPanelMaxMapArea: 0,
						// Не скрываем иконку при открытом балуне.
						hideIconOnBalloonOpen: true,
						// И дополнительно смещаем балун, для открытия над иконкой.
						balloonOffset: [0, -40],
						iconLayout: 'default#image',
						iconImageHref: '/local/templates/.default/mockup/templates/main/build/images/lens-sign-blue.svg',
						// iconImageHref: '../images/lens-sign-blue.svg',
						iconImageSize: [52, 46],
						iconImageOffset: [-26, -46]
					});

		} else {

			myPlacemark = new ymaps.Placemark([opts.coords[i].x, opts.coords[i].y], {}, {
				// Не скрываем иконку при открытом балуне.
				hideIconOnBalloonOpen: false,
				// И дополнительно смещаем балун, для открытия над иконкой.
				balloonOffset: [0, -40],
				iconLayout: 'default#image',
				iconImageHref: '/local/templates/.default/mockup/templates/main/build/images/lens-sign-blue.svg',
				// iconImageHref: '../images/lens-sign-blue.svg',
				iconImageSize: [52, 46],
				iconImageOffset: [-26, -46]
			});

		}

		myMap.geoObjects.add(myPlacemark);

		if (opts.callback) {
			opts.callback();
		}

	}

}

ymaps.ready(function () {

	// contacts page
	(function () {

		var maps = document.querySelectorAll('.js-contact__map');

		$(maps).each(function () {

			var _coords = [];
			var _tmp = (this.getAttribute('data-coords')).split(',');

			_coords.push({
				x: parseFloat(_tmp[0]),
				y: parseFloat(_tmp[1])
			});

			initMaps({
				map: this,
				zoom: 17,
				center: [_coords[0].x, _coords[0].y],
				coords: _coords
			});

		});

	})();

	// main page
	(function () {

		var mainMap = document.querySelector('#js-diagnostics__map');
		if (!mainMap) {
			return false;
		}

		var _coords = [];
		var _center = [55.756251, 49.210635];

		_coords.push({
			x: 55.756881,
			y: 49.210458,
			title: 'ТЦ Внуково Аутлет Вилладж 1',
			content: 'Киевское ш. 8 км. от МКАД, пос.Московский, дер.Лапшинка 8к1<div class="map-popup__time">8(495) 280-70 - 41</div><a href="#" class="map-popup__link">Запись на проверку зрения</a>'
		});

		_coords.push({
			x: 55.756176,
			y: 49.213913,
			title: 'ТЦ Внуково Аутлет Вилладж 2',
			content: 'Киевское ш. 8 км. от МКАД, пос.Московский, дер.Лапшинка 8к1<div class="map-popup__time">8(495) 280-70 - 41</div><a href="#" class="map-popup__link">Запись на проверку зрения</a>'
		});

		_coords.push({
			x: 55.754987,
			y: 49.210254,
			title: 'ТЦ Внуково Аутлет Вилладж 3',
			content: 'Киевское ш. 8 км. от МКАД, пос.Московский, дер.Лапшинка 8к1<div class="map-popup__time">8(495) 280-70 - 41</div><a href="#" class="map-popup__link">Запись на проверку зрения</a>'
		});

		initMaps({
			map: mainMap,
			zoom: 15,
			center: _center,
			coords: _coords,
			popup: true
		});

	})();

	//appointment page
	(function () {

		var mainMap = document.querySelector('#js-appointment__map');
		if (!mainMap) {
			return false;
		}

		var _coords = [];
		var _center = [55.756251, 49.210635];

		_coords.push({
			x: 55.756881,
			y: 49.210458,
			title: 'ТЦ Внуково Аутлет Вилладж 1',
			content: 'Киевское ш. 8 км. от МКАД, пос.Московский, дер.Лапшинка 8к1<div class="map-popup__time">8(495) 280-70 - 41</div><a href="#" class="map-popup__link">Запись на проверку зрения</a>'
		});

		_coords.push({
			x: 55.756176,
			y: 49.213913,
			title: 'ТЦ Внуково Аутлет Вилладж 2',
			content: 'Киевское ш. 8 км. от МКАД, пос.Московский, дер.Лапшинка 8к1<div class="map-popup__time">8(495) 280-70 - 41</div><a href="#" class="map-popup__link">Запись на проверку зрения</a>'
		});

		_coords.push({
			x: 55.754987,
			y: 49.210254,
			title: 'ТЦ Внуково Аутлет Вилладж 3',
			content: 'Киевское ш. 8 км. от МКАД, пос.Московский, дер.Лапшинка 8к1<div class="map-popup__time">8(495) 280-70 - 41</div><a href="#" class="map-popup__link">Запись на проверку зрения</a>'
		});

		initMaps({
			map: mainMap,
			zoom: 15,
			center: _center,
			coords: _coords,
			popup: true
		});

	})();

});