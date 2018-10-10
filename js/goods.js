'use strict';

(function () {

  var listProductsCopy;

  window.startApp = function (data) {
    //
    var listProducts = data;
    listProductsCopy = listProducts.slice(0);
    var listProductsBag = []; // список товаров в корзине
    //
    var HIDDEN = 'visually-hidden';
    //
    // функция РЕНДЕР - КАРТОЧКИ ТОВАРОВ

    var cardTemplate = document.querySelector('#card')
        .content
        .querySelector('.catalog__card');

    var renderProduct = function (product) {

      var classStarsRating = [
        'stars__rating--one',
        'stars__rating--two',
        'stars__rating--three',
        'stars__rating--four',
        'stars__rating--five'
      ];

      var cardProduct = cardTemplate.cloneNode(true);

      cardProduct.classList.remove('card--in-stock');

      var classCardAmount = 'card--little';
      if (product.amount === 0) {
        classCardAmount = 'card--soon';
      }
      if (product.amount > 5) {
        classCardAmount = 'card--in-stock';
      }
      cardProduct.classList.add(classCardAmount);

      var catalogCardImgName = product.picture.slice(0, -4);
      cardProduct.setAttribute('id', 'catalog-card__' + catalogCardImgName);

      cardProduct.querySelector('.card__title').textContent = product.name;
      cardProduct.querySelector('.card__img').src = 'img/cards/' + product.picture;
      cardProduct.querySelector('.card__img').alt = product.kind;
      cardProduct.querySelector('.card__price').innerHTML = (
        product.price + '<span class="card__currency">₽</span><span class="card__weight">/' + product.weight + 'Г</span>'
      );

      var starsRating = cardProduct.querySelector('.stars__rating');

      starsRating.textContent = 'Рейтинг: ' + product.rating.value + ' звёзд';
      starsRating.classList.remove('stars__rating--five');
      starsRating.classList.add(classStarsRating[product.rating.value - 1]);

      cardProduct.querySelector('.star__count').textContent = product.rating.number;

      cardProduct.querySelector('.card__characteristic').textContent = product.nutritionFacts.sugar
        ? 'Содержит сахар. ' + product.nutritionFacts.energy + ' ккал'
        : 'Без сахара. ' + product.nutritionFacts.energy + ' ккал';

      cardProduct.querySelector('.card__composition-list').innerHTML = product.nutritionFacts.contents;

      // cardProduct.querySelector('.catalog__card').addEventListener('click', onProductClick); // !!!!!
      return cardProduct;
    };

    var catalogCards = document.querySelector('.catalog__cards');

    // функция для отрисовки в дом

    var addProductsDom = function (products) {

      var fragment = document.createDocumentFragment();

      for (var i = 0; i < products.length; i++) {
        fragment.appendChild(renderProduct(products[i]));
      }
      catalogCards.appendChild(fragment);

      catalogCards.classList.remove('catalog__cards--load');
      document.querySelector('.catalog__load').classList.add(HIDDEN);
      document.querySelector('.catalog__btn-more').classList.remove(HIDDEN);
    };

    // вызываем функцию и отрисовываем товар в дом
    addProductsDom(listProductsCopy);
    //

    /*
    // покажи еще
    var onBtnMoreClick = function (evt) {
      evt.preventDefault();
      if (evt.target.classList.contains('catalog__btn-more') {
      }
    };
    */

    // класс для товара

    var getClassCardAmount = function (element, elementNod) {

      var classCardAmount = 'card--little';
      if (element.amount === 0) {
        classCardAmount = 'card--soon';
      }
      if (element.amount > 5) {
        classCardAmount = 'card--in-stock';
      }

      elementNod.classList = '';
      elementNod.classList.add('catalog__card', 'card', classCardAmount);
    };

    // индекс искомого элемента

    var getIndexProductEvent = function (name) {
      return function (element) {
        return element.name === name;
      };
    };

    // подготовим продукт для корзины

    var getProductBag = function (card) {

      var productBag = Object.assign({}, card, {
        orderedAmount: 1,
      });

      delete productBag.nutritionFacts;
      delete productBag.rating;
      delete productBag.weight;

      return productBag;
    };

    // функция РЕНДЕР для КОРЗИНЫ
    var goodsCards = document.querySelector('.goods__cards');

    var bagTemplate = document.querySelector('#card-order')
    .content
    .querySelector('.goods_card');

    var renderBag = function (order) {

      var bagProduct = bagTemplate.cloneNode(true);

      var cardOrderImgName = order.picture.slice(0, -4);

      bagProduct.querySelector('.card-order__title').textContent = order.name;
      bagProduct.querySelector('.card-order__img').src = 'img/cards/' + order.picture;
      bagProduct.querySelector('.card-order__img').alt = order.kind;
      bagProduct.querySelector('.card-order__price').innerHTML = order.price + ' ₽';
      bagProduct.querySelector('.card-order__count').name = cardOrderImgName;
      bagProduct.querySelector('.card-order__count').id = 'card-order__' + cardOrderImgName;
      bagProduct.querySelector('.card-order__count').value = order.orderedAmount;

      bagProduct.querySelector('.card-order__close').addEventListener('click', onButtonCloseBagClick);
      bagProduct.querySelector('.card-order__main').addEventListener('click', onButtonAmountBagClick);

      return bagProduct;
    };

    // функция для отрисовки корзины в дом

    var addProductsBagDom = function (goods) {

      var fragmentBag = document.createDocumentFragment();

      for (var i = 0; i < goods.length; i++) {
        fragmentBag.appendChild(renderBag(goods[i]));
      }
      goodsCards.appendChild(fragmentBag);

      goodsCards.classList.remove('goods__cards--empty');
      document.querySelector('.goods__card-empty').classList.add(HIDDEN);
      document.querySelector('.goods__total').classList.remove(HIDDEN);
      window.getRemoveDisable(window.order.inputsForm);
      window.order.buySubmitBtn.removeAttribute('disabled');
    };


    // ДОБАВЛЕНИЕ элемента в массив и дом В КОРЗИНУ

    var OnButtonCardAddClick = function (evt) {
      evt.preventDefault();

      if (evt.target.classList.contains('card__btn')) {

        // проверяем класс и если нет товаров, то ничего не делаем

        if (evt.currentTarget.classList.contains('card--soon')) {
          return;
        }

        // иначе - вытаскиваем имя карточки

        var productEvent = evt.currentTarget.querySelector('.card__title').textContent;

        // ищем карточку по имени в массиве товаров и преобразуем для корзины

        var indexProductEvent = listProductsCopy.findIndex(getIndexProductEvent(productEvent));

        var productOrder = getProductBag(listProductsCopy[indexProductEvent]);

        listProductsCopy[indexProductEvent].amount--;

        // проверяем класс в доме и меняем при необходимости

        getClassCardAmount(listProductsCopy[indexProductEvent], evt.currentTarget);
        // вытаскиеваем id карточки

        var idProductEvent = evt.currentTarget.getAttribute('id');

        // есть ли такой товар в корзине?

        var idGoodsCard = '#' + 'card-order__' + idProductEvent.split('__')[1];

        if (goodsCards.querySelector(idGoodsCard) === null) {

          listProductsBag.push(productOrder); // добавляем товар в массив корзины
          addProductsBagDom([productOrder]); // отрисовываем товар (в дом)

        } else {
          goodsCards.querySelector(idGoodsCard).value++;

          var indexProductBagEvent = listProductsBag.findIndex(getIndexProductEvent(productEvent));

          listProductsBag[indexProductBagEvent].orderedAmount++;
        }
        getGoodsTotalCount();
      }
    };

    // УДАЛЕНИЕ элемента из массива и дома ИЗ КОРЗИНЫ

    var onButtonCloseBagClick = function (evt) {
      evt.preventDefault();

      if (evt.target.classList.contains('card-order__close')) {

        // вытаскиваем имя карточки

        var productEvent = evt.target.parentElement.querySelector('.card-order__title').textContent;

        // ищем по имени эту карточку в списке продуктов и плюсуем кол-во обратно

        var indexProductEvent = listProductsCopy.findIndex(getIndexProductEvent(productEvent));

        var idProduct = '#catalog-card__' + evt.target.parentElement.querySelector('.card-order__count').name;

        listProductsCopy[indexProductEvent].amount += parseInt(evt.target.parentElement.querySelector('.card-order__count').value, 10);

        // ищем карточку по имени в массиве корзины товаров и удаляем

        listProductsBag = listProductsBag.filter(function (product) {
          return product.name !== productEvent;
        });

        // удаляем карточку в доме

        goodsCards.removeChild(evt.target.parentElement);

        // проверяем не пустая ли карзина
        if (listProductsBag.length === 0) {
          document.querySelector('.goods__card-empty').classList.remove(HIDDEN);
          document.querySelector('.goods__total').classList.add(HIDDEN);
          window.getSetDisable(window.order.inputsForm);
          window.order.buySubmitBtn.setAttribute('disabled', 'disable');
        }

        getGoodsTotalCount();
        // проверяем класс в доме и меняем при необходимости

        getClassCardAmount(listProductsCopy[indexProductEvent], document.querySelector(idProduct));
      }
    };

    // КОЛ-ВО В КОРЗИНЕ товаров

    var getGoodsTotalCount = function () {

      var initialValue = 0;

      var goodsTotalCount = listProductsBag.reduce(function (accumulator, currentValue) {
        return accumulator + currentValue.orderedAmount;
      }, initialValue);

      var caseGood = ' товаров';

      if (goodsTotalCount === 1) {
        caseGood = ' товар';
      }
      if (goodsTotalCount > 1 && goodsTotalCount < 5) {
        caseGood = ' товара';
      }

      document.querySelector('.goods__total-count').childNodes[0].textContent = 'Итого за ' + goodsTotalCount + caseGood + ':';
      document.querySelector('.main-header__basket').textContent = 'В корзине ' + goodsTotalCount + caseGood + ' на ' + getGoodsPrice() + ' ₽';
      document.querySelector('.goods__price').textContent = getGoodsPrice() + ' ₽';

      if (listProductsBag.length === 0) {
        document.querySelector('.main-header__basket').textContent = 'В корзине ничего нет';
      }
    };

    // ЦЕНА товаров В КОРЗИНЕ

    var getGoodsPrice = function () {

      var initialValue = 0;

      var goodsPrice = listProductsBag.reduce(function (accumulator, currentValue) {
        return accumulator + currentValue.price * currentValue.orderedAmount;
      }, initialValue);

      return goodsPrice;
    };

    // навешиваем обработчик - Добавить в корзину

    var catalogCard = document.querySelectorAll('.catalog__card');

    catalogCard.forEach(function (element) {
      element.addEventListener('click', OnButtonCardAddClick);
    });

    // УМЕНЬШИТЬ и УВЕЛИЧИТЬ кол-во товара

    var onButtonAmountBagClick = function (evt) {

      // вытаскиваем имя карточки

      var productEvent = evt.currentTarget.parentElement.querySelector('.card-order__title').textContent;

      var indexProductBagEvent = listProductsBag.findIndex(getIndexProductEvent(productEvent));
      var indexProductEvent = listProductsCopy.findIndex(getIndexProductEvent(productEvent));

      var idProduct = '#catalog-card__' + evt.currentTarget.querySelector('.card-order__count').name;

      if (evt.target.classList.contains('card-order__btn--decrease')) {
        evt.currentTarget.querySelector('.card-order__count').value--;

        listProductsBag[indexProductBagEvent].orderedAmount--;

        if (listProductsBag[indexProductBagEvent].orderedAmount === 0) {

        // ищем карточку по колл-ву в массиве корзины товаров и удаляем

          listProductsBag = listProductsBag.filter(function (product) {
            return product.orderedAmount !== 0;
          });

          // удаляем карточку в доме

          goodsCards.removeChild(evt.currentTarget.parentElement);

          // проверяем не пустая ли корзина
          if (listProductsBag.length === 0) {
            document.querySelector('.goods__card-empty').classList.remove(HIDDEN);
            document.querySelector('.goods__total').classList.add(HIDDEN);
            window.getSetDisable(window.order.inputsForm);
            window.order.buySubmitBtn.setAttribute('disabled', 'disable');
          }
        }

        listProductsCopy[indexProductEvent].amount++;

        getGoodsTotalCount();
        getClassCardAmount(listProductsCopy[indexProductEvent], document.querySelector(idProduct));
      }

      if (evt.target.classList.contains('card-order__btn--increase')) {

        // проверяем класс

        if (document.querySelector(idProduct).classList.contains('card--soon')) {
          return;
        }

        evt.currentTarget.querySelector('.card-order__count').value++;

        listProductsBag[indexProductBagEvent].orderedAmount++;

        listProductsCopy[indexProductEvent].amount--;

        getGoodsTotalCount();
        getClassCardAmount(listProductsCopy[indexProductEvent], document.querySelector(idProduct));
      }
    };

    // дабавить и удалить в/из ИЗБРАННОЕ:

    var cardsBtnFavorite = document.querySelectorAll('.card__btn-favorite');

    var OnCardBtnFavoriteClick = function (evt) {
      evt.preventDefault();
      evt.target.classList.toggle('card__btn-favorite--selected');
      evt.target.blur(); // НЕ ЗАБЫТЬ УБРАТЬ
    };

    cardsBtnFavorite.forEach(function (element) {
      element.addEventListener('click', OnCardBtnFavoriteClick);
    });
  };

  window.errorHandler = function (errorMessage) {
    var node = document.createElement('div');
    node.style = 'z-index: 100; margin: 0 auto; text-align: center; background-color: red;';
    node.style.position = 'absolute';
    node.style.left = 0;
    node.style.right = 0;
    node.style.fontSize = '30px';

    node.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', node);
  };

  window.goods = {
    listProductsCopy: listProductsCopy
  };
})();
