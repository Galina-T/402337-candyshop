'use strict';

(function () {
  // ФИЛЬТРЫ
  var inputBtnLabel = document.querySelectorAll('.input-btn__label'); // надпись
  var inputBtnItemCount = document.querySelectorAll('.input-btn__item-count'); // число

  // массивы продуктов для фильтра

  var ice = window.goods.listProductsCopy.filter(function (product) {
    return product.kind === 'Мороженое';
  });
  var soda = window.goods.listProductsCopy.filter(function (product) {
    return product.kind === 'Газировка';
  });
  var gum = window.goods.listProductsCopy.filter(function (product) {
    return product.kind === 'Жевательная резинка';
  });
  var marmalade = window.goods.listProductsCopy.filter(function (product) {
    return product.kind === 'Мармелад';
  });
  var marshmallow = window.goods.listProductsCopy.filter(function (product) {
    return product.kind === 'Зефир';
  });

  var sugar = window.goods.listProductsCopy.filter(function (product) {
    return product.nutritionFacts.sugar === false;
  });
  var vegetarian = window.goods.listProductsCopy.filter(function (product) {
    return product.nutritionFacts.vegetarian === true;
  });
  var gluten = window.goods.listProductsCopy.filter(function (product) {
    return product.nutritionFacts.gluten === false;
  });

  // вставим в дом
  var addQuantityGoodsDom = function (idGoods, quantityGoods) {
    idGoods.parentElement.querySelector('.input-btn__item-count').textContent = '(' + quantityGoods + ')';
  };

  var idIce = document.querySelector('#filter-icecream');
  var idSoda = document.querySelector('#filter-soda');
  var idGum = document.querySelector('#filter-gum');
  var idMarmalade = document.querySelector('#filter-marmalade');
  var idMarshmallow = document.querySelector('#filter-marshmallows');

  var idSugar = document.querySelector('#filter-sugar-free');
  var idVegetarian = document.querySelector('#filter-vegetarian');
  var idGluten = document.querySelector('#filter-gluten-free');

  var rangeCount = document.querySelector('.range__count');

  var idFavorite = document.querySelector('#filter-favorite');
  var idAvailability = document.querySelector('#filter-availability');

  addQuantityGoodsDom(idIce, ice.length);
  addQuantityGoodsDom(idSoda, soda.length);
  addQuantityGoodsDom(idGum, gum.length);
  addQuantityGoodsDom(idMarmalade, marmalade.length);
  addQuantityGoodsDom(idMarshmallow, marshmallow.length);

  addQuantityGoodsDom(idSugar, sugar.length);
  addQuantityGoodsDom(idVegetarian, vegetarian.length);
  addQuantityGoodsDom(idGluten, gluten.length);
  //

  // ПОЛЗУНОК нажимаем, тащим, отпускаем мышку mouseup

  var rangeFilter = document.querySelector('.range__filter');
  var rangeBtnLeft = rangeFilter.querySelector('.range__btn--left');
  var rangeBtnRight = rangeFilter.querySelector('.range__btn--right');
  var rangeFillLine = rangeFilter.querySelector('.range__fill-line');

  var reducerMinPrice = function (accumulator, currentValue) {
    var minPrice = Math.min(accumulator.price, currentValue.price);
    return {price: minPrice};
  };

  var reducerMaxPrice = function (accumulator, currentValue) {
    var maxPrice = Math.max(accumulator.price, currentValue.price);
    return {price: maxPrice};
  };

  var minMaxPrice = {
    priceMin: window.goods.listProductsCopy.reduce(reducerMinPrice).price,
    priceMax: window.goods.listProductsCopy.reduce(reducerMaxPrice).price
  };

  var scalePrice = minMaxPrice.priceMax - minMaxPrice.priceMin;

  var scaleWidth = rangeFilter.offsetWidth - rangeBtnRight.offsetWidth;

  var step = scalePrice / scaleWidth;

  var minMaxCoord = {
    minX: rangeFilter.offsetLeft,
    maxX: rangeFilter.offsetLeft + rangeFilter.offsetWidth
  };

  var onButtonRangeMousedown = function (evt) {
    evt.preventDefault();

    var pin = {};

    // левый пин

    if (evt.target.classList.contains('range__btn--left')) {
      pin = {
        element: rangeBtnLeft,
        x: rangeFilter.offsetLeft + rangeBtnLeft.offsetLeft,
        xMin: minMaxCoord.minX,
        xMax: minMaxCoord.minX + rangeBtnRight.offsetLeft,
        offsetMin: 0,
        offsetMax: rangeBtnRight.offsetLeft,
        priceClass: '.range__price--min',
        fillLineX: rangeFillLine.offsetLeft
      };
      rangeBtnLeft.style.zIndex = '4';
      rangeBtnRight.style.zIndex = '3';

    }
    // правый пин

    if (evt.target.classList.contains('range__btn--right')) {
      pin = {
        element: rangeBtnRight,
        x: rangeFilter.offsetLeft + rangeBtnRight.offsetLeft,
        xMin: minMaxCoord.minX + rangeBtnLeft.offsetLeft,
        xMax: minMaxCoord.maxX - rangeBtnRight.offsetWidth,
        offsetMin: rangeBtnLeft.offsetLeft,
        offsetMax: scaleWidth,
        priceClass: '.range__price--max',
        FillLineWidth: rangeFillLine.offsetWidth
      };
      rangeBtnLeft.style.zIndex = '3';
      rangeBtnRight.style.zIndex = '4';
    }

    // для перемещения

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = pin.x - moveEvt.clientX;

      pin.x = moveEvt.clientX;

      var result = pin.element.offsetLeft - shift;

      if (pin.x < pin.xMin) {
        result = pin.offsetMin;
      }
      if (pin.x > pin.xMax) {
        result = pin.offsetMax;
      }

      pin.element.style.left = result + 'px';

      if (evt.target.classList.contains('range__btn--left')) {
        rangeFillLine.style.left = result + 'px';
      }

      if (evt.target.classList.contains('range__btn--right')) {
        rangeFillLine.style.right = scaleWidth - result + 'px';
      }
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      var upCoord = upEvt.clientX;

      if (upCoord < pin.xMin) {
        upCoord = pin.xMin;
      }
      if (upCoord > pin.xMax) {
        upCoord = pin.xMax;
      }

      var shiftUp = pin.element.offsetLeft;

      var rangeBtnPrice = Math.round(step * shiftUp + minMaxPrice.priceMin);

      document.querySelector(pin.priceClass).textContent = rangeBtnPrice;

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  rangeBtnLeft.addEventListener('mousedown', onButtonRangeMousedown);
  rangeBtnRight.addEventListener('mousedown', onButtonRangeMousedown);
})();
