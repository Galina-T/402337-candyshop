'use strict';

var HIDDEN = 'visually-hidden';

var namesProducts = [
  'Чесночные сливки',
  'Огуречный педант',
  'Молочная хрюша',
  'Грибной шейк',
  'Баклажановое безумие',
  'Паприколу итальяно',
  'Нинзя-удар васаби',
  'Хитрый баклажан',
  'Горчичный вызов',
  'Кедровая липучка',
  'Корманный портвейн',
  'Чилийский задира',
  'Беконовый взрыв',
  'Арахис vs виноград',
  'Сельдерейная душа',
  'Початок в бутылке',
  'Чернющий мистер чеснок',
  'Раша федераша',
  'Кислая мина',
  'Кукурузное утро',
  'Икорный фуршет',
  'Новогоднее настроение',
  'С пивком потянет',
  'Мисс креветка',
  'Бесконечный взрыв',
  'Невинные винные',
  'Бельгийское пенное',
  'Острый язычок'
];

var linksPicturesProducts = [
  'img/cards/gum-cedar.jpg',
  'img/cards/gum-chile.jpg',
  'img/cards/gum-eggplant.jpg',
  'img/cards/gum-mustard.jpg',
  'img/cards/gum-portwine.jpg',
  'img/cards/gum-wasabi.jpg',
  'img/cards/ice-cucumber.jpg',
  'img/cards/ice-eggplant.jpg',
  'img/cards/ice-garlic.jpg',
  'img/cards/ice-italian.jpg',
  'img/cards/ice-mushroom.jpg',
  'img/cards/ice-pig.jpg',
  'img/cards/marmalade-beer.jpg',
  'img/cards/marmalade-caviar.jpg',
  'img/cards/marmalade-corn.jpg',
  'img/cards/marmalade-new-year.jpg',
  'img/cards/marmalade-sour.jpg',
  'img/cards/marshmallow-bacon.jpg',
  'img/cards/marshmallow-beer.jpg',
  'img/cards/marshmallow-shrimp.jpg',
  'img/cards/marshmallow-spicy.jpg',
  'img/cards/marshmallow-wine.jpg',
  'img/cards/soda-bacon.jpg',
  'img/cards/soda-celery.jpg',
  'img/cards/soda-cob.jpg',
  'img/cards/soda-garlic.jpg',
  'img/cards/soda-peanut-grapes.jpg',
  'img/cards/soda-russian.jpg'
];

var contentsProducts = [
  'молоко',
  'сливки',
  'вода',
  'пищевой краситель',
  'патока',
  'ароматизатор бекона',
  'ароматизатор свинца',
  'ароматизатор дуба, идентичный натуральному',
  'ароматизатор картофеля',
  'лимонная кислота',
  'загуститель',
  'эмульгатор',
  'консервант: сорбат калия',
  'посолочная смесь: соль, нитрит натрия',
  'ксилит',
  'карбамид',
  'вилларибо',
  'виллабаджо'
];

var getIndexProductEvent = function (name) {
  return function (element) {
    return element.name === name;
  };
};

// случайное число:

var getRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// путь - имя картинки

var getFileName = function (path) {
  var from = path.lastIndexOf('/');
  var to = path.lastIndexOf('.');

  return path.slice(from + 1, to);
};

// перемешевание массива

var shuffleArray = function (array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
};

// функция для состава

var getRandomContents = function (contentsAmount) {

  var randomContents = shuffleArray(contentsProducts);
  randomContents.length = contentsAmount;

  return randomContents.join(', ');
};

// массив обьектов

var getList = function (objectCreator, amount) {
  var list = [];

  var namesProductsShuffle = shuffleArray(namesProducts);
  var linksPicturesProductsShuffle = shuffleArray(linksPicturesProducts);

  for (var i = 0; i < amount; i++) {
    list.push(objectCreator(namesProductsShuffle, linksPicturesProductsShuffle, i));
  }
  return list;
};

//  продукт

var getProduct = function (newNames, newPictures, number) {

  return {
    name: newNames[number],
    picture: newPictures[number],
    amount: getRandomNumber(0, 20),
    price: getRandomNumber(100, 1500),
    weight: getRandomNumber(30, 300),
    rating: {
      value: getRandomNumber(1, 5),
      number: getRandomNumber(10, 900),
    },
    nutritionFacts: {
      sugar: Boolean(getRandomNumber(0, 1)),
      energy: getRandomNumber(70, 500),
      contents: getRandomContents(getRandomNumber(1, contentsProducts.length)),
    },
  };
};

// продукт в корзине

var getProductBag = function (card) {

  var productBag = Object.assign({}, card, {
    orderedAmount: 1,
  });

  delete productBag.nutritionFacts;
  delete productBag.rating;
  delete productBag.weight;

  return productBag;
};

// КАРТОЧКИ ТОВАРОВ

var renderProducts = function (products) {

  document.querySelector('.catalog__load').classList.add(HIDDEN);

  var catalogCards = document.querySelector('.catalog__cards');
  catalogCards.classList.remove('catalog__cards--load');

  var cardTemplate = document.querySelector('#card')
    .content
    .querySelector('.catalog__card');

  var classStarsRating = [
    'stars__rating--one',
    'stars__rating--two',
    'stars__rating--three',
    'stars__rating--four',
    'stars__rating--five'
  ];

  for (var i = 0; i < products.length; i++) {

    var cardProduct = cardTemplate.cloneNode(true);

    cardProduct.classList.remove('card--in-stock');

    var classCardAmount = 'card--little';
    if (products[i].amount === 0) {
      classCardAmount = 'card--soon';
    }
    if (products[i].amount > 5) {
      classCardAmount = 'card--in-stock';
    }
    cardProduct.classList.add(classCardAmount);

    var catalogCardImgName = getFileName(products[i].picture);

    cardProduct.setAttribute('id', 'catalog-card__' + catalogCardImgName);

    cardProduct.querySelector('.card__title').textContent = products[i].name;
    cardProduct.querySelector('.card__img').src = products[i].picture;
    cardProduct.querySelector('.card__price').innerHTML = (
      products[i].price + '<span class="card__currency">₽</span><span class="card__weight">/' + products[i].weight + 'Г</span>'
    );

    var starsRating = cardProduct.querySelector('.stars__rating');
    starsRating.textContent = 'Рейтинг: ' + products[i].rating.value + ' звёзд';
    starsRating.classList.remove('stars__rating--five');
    starsRating.classList.add(classStarsRating[products[i].rating.value - 1]);

    cardProduct.querySelector('.star__count').textContent = products[i].rating.number;

    cardProduct.querySelector('.card__characteristic').textContent = products[i].nutritionFacts.sugar
      ? 'Содержит сахар. ' + products[i].nutritionFacts.energy + ' ккал'
      : 'Без сахара. ' + products[i].nutritionFacts.energy + ' ккал';

    cardProduct.querySelector('.card__composition-list').innerHTML = products[i].nutritionFacts.contents;

    catalogCards.appendChild(cardProduct);
  }
};

// КОРЗИНА

var renderBag = function (order) {

  var goodsCards = document.querySelector('.goods__cards');
  goodsCards.classList.remove('goods__cards--empty');

  var bagTemplate = document.querySelector('#card-order')
      .content
      .querySelector('.goods_card');

  for (var i = 0; i < order.length; i++) {

    var bagProduct = bagTemplate.cloneNode(true);

    var cardOrderImgName = getFileName(order[i].picture);

    bagProduct.querySelector('.card-order__title').textContent = order[i].name;
    bagProduct.querySelector('.card-order__img').src = order[i].picture;
    bagProduct.querySelector('.card-order__price').innerHTML = order[i].price + ' ₽';
    bagProduct.querySelector('.card-order__count').name = cardOrderImgName;
    bagProduct.querySelector('.card-order__count').id = 'card-order__' + cardOrderImgName;
    bagProduct.querySelector('.card-order__count').value = order[i].orderedAmount;

    bagProduct.querySelector('.card-order__close').addEventListener('click', onButtonCloseBagClick);
    bagProduct.querySelector('.card-order__main').addEventListener('click', onButtonAmountBagClick);

    goodsCards.appendChild(bagProduct);
  }

  document.querySelector('.goods__card-empty').classList.add(HIDDEN);
  document.querySelector('.goods__total').classList.remove(HIDDEN);
};

// ВЫЗОВ ФУНКЦИЙ

var listProducts = getList(getProduct, 26); // список товаров

renderProducts(listProducts);

var listProductsBag = []; // список товаров в корзине


// ДОБАВЛЕНИЕ элемента в массив и дом В КОРЗИНУ

var OnButtonCardAddClick = function (evt) {
  evt.preventDefault();

  if (evt.target.classList.contains('card__btn')) {

    // вытаскиваем имя карточки

    var productEvent = evt.currentTarget.querySelector('.card__title').textContent;

    // ищем карточку по имени в массиве товаров и преобразуем для корзины

    var indexProductEvent = listProducts.findIndex(getIndexProductEvent(productEvent));

    var productOrder = getProductBag(listProducts[indexProductEvent]);

    listProducts[indexProductEvent].amount--;

    // вытаскиеваем id карточки

    var idProductEvent = evt.currentTarget.getAttribute('id');

    // есть ли такой товар в корзине?

    var goodsCards = document.querySelector('.goods__cards');

    var idGoodsCard = '#' + 'card-order__' + idProductEvent.split('__')[1];

    if (goodsCards.querySelector(idGoodsCard) === null) {

      listProductsBag.push(productOrder); // добавляем товар в массив корзины
      renderBag([productOrder]); // отрисовываем товар (в дом)

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

    // ищем карточку по имени в массиве корзины товаров и удаляем

    listProductsBag = listProductsBag.filter(function (product) {
      return product.name !== productEvent;
    });

    // удаляем карточку в доме

    var goodsCards = document.querySelector('.goods__cards');

    goodsCards.removeChild(evt.target.parentElement);

    // проверяем не пустая ли карзина
    if (listProductsBag.length === 0) {
      document.querySelector('.goods__card-empty').classList.remove(HIDDEN);
      document.querySelector('.goods__total').classList.add(HIDDEN);
    }
    getGoodsTotalCount();
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

// Добавить в корзину

var catalogCard = document.querySelectorAll('.catalog__card');

for (var i = 0; i < catalogCard.length; i++) {
  catalogCard[i].addEventListener('click', OnButtonCardAddClick);
}

// ОБРАБОТЧИКИ

// УМЕНЬШИТЬ и УВЕЛИЧИТЬ кол-во товара

var onButtonAmountBagClick = function (evt) {

  // вытаскиваем имя карточки

  var productEvent = evt.currentTarget.parentElement.querySelector('.card-order__title').textContent;

  var indexProductBagEvent = listProductsBag.findIndex(getIndexProductEvent(productEvent));
  var indexProductEvent = listProducts.findIndex(getIndexProductEvent(productEvent));

  if (evt.target.classList.contains('card-order__btn--decrease')) {
    evt.currentTarget.querySelector('.card-order__count').value--;

    listProductsBag[indexProductBagEvent].orderedAmount--;

    if (listProductsBag[indexProductBagEvent].orderedAmount === 0) {

    // ищем карточку по колл-ву в массиве корзины товаров и удаляем

      listProductsBag = listProductsBag.filter(function (product) {
        return product.orderedAmount !== 0;
      });

      // удаляем карточку в доме

      var goodsCards = document.querySelector('.goods__cards');

      goodsCards.removeChild(evt.currentTarget.parentElement);

      // проверяем не пустая ли карзина
      if (listProductsBag.length === 0) {
        document.querySelector('.goods__card-empty').classList.remove(HIDDEN);
        document.querySelector('.goods__total').classList.add(HIDDEN);
      }
    }

    listProducts[indexProductEvent].amount++;

    getGoodsTotalCount();
  }

  if (evt.target.classList.contains('card-order__btn--increase')) {
    evt.currentTarget.querySelector('.card-order__count').value++;

    listProductsBag[indexProductBagEvent].orderedAmount++;

    listProducts[indexProductEvent].amount--;

    getGoodsTotalCount();
  }
};

// дабавить и удалить в/из ИЗБРАННОЕ:

var cardsBtnFavorite = document.querySelectorAll('.card__btn-favorite');

var OnCardBtnFavoriteClick = function (evt) {
  evt.preventDefault();
  evt.target.classList.toggle('card__btn-favorite--selected');
  evt.target.blur(); // НЕ ЗАБЫТЬ УБРАТЬ
};

for (var j = 0; j < cardsBtnFavorite.length; j++) {
  cardsBtnFavorite[j].addEventListener('click', OnCardBtnFavoriteClick);
}

// ПЕРЕКЛЮЧЕНИЕ ВКЛАДОК

var paymentInner = document.querySelector('.payment__inner');

paymentInner.addEventListener('click', function (evt) {

  if (evt.target.getAttribute('for') === 'payment__card') {

    evt.currentTarget.querySelector('.payment__card-wrap').classList.remove(HIDDEN);
    evt.currentTarget.querySelector('.payment__cash-wrap').classList.add(HIDDEN);

  }
  if (evt.target.getAttribute('for') === 'payment__cash') {

    evt.currentTarget.querySelector('.payment__cash-wrap').classList.remove(HIDDEN);
    evt.currentTarget.querySelector('.payment__card-wrap').classList.add(HIDDEN);

  }
});

// ДОСТАВКА

var deliver = document.querySelector('.deliver');

deliver.addEventListener('click', function (evt) {

  if (evt.target.getAttribute('for') === 'deliver__store') {

    evt.currentTarget.querySelector('.deliver__store').classList.remove(HIDDEN);
    evt.currentTarget.querySelector('.deliver__courier').classList.add(HIDDEN);

  }
  if (evt.target.getAttribute('for') === 'deliver__courier') {

    evt.currentTarget.querySelector('.deliver__courier').classList.remove(HIDDEN);
    evt.currentTarget.querySelector('.deliver__store').classList.add(HIDDEN);

  }
});


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
  priceMin: listProducts.reduce(reducerMinPrice).price,
  priceMax: listProducts.reduce(reducerMaxPrice).price
};

var scalePrice = minMaxPrice.priceMax - minMaxPrice.priceMin;

var scaleWidth = rangeFilter.offsetWidth - rangeBtnRight.offsetWidth;

var step = scalePrice / scaleWidth; // шаг

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

