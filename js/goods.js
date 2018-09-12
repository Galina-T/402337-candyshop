'use strict';

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

var getRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var shuffleArray = function (array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
};

var getRandomContents = function (contentsAmount) {

  var randomContents = shuffleArray(contentsProducts);
  randomContents.length = contentsAmount;

  return randomContents.join(', ');
};

var getProduct = function () {
  return {
    name: namesProducts[getRandomNumber(0, namesProducts.length - 1)],
    picture: linksPicturesProducts[getRandomNumber(0, linksPicturesProducts.length - 1)],
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

var getList = function (objectCreator, amount) {
  var list = [];
  for (var i = 0; i < amount; i++) {
    list.push(objectCreator());
  }
  return list;
};

var renderProducts = function () {

  var listProducts = getList(getProduct, 26);

  document.querySelector('.catalog__load').classList.add('visually-hidden');

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

  for (var i = 0; i < 26; i++) {

    var cardProduct = cardTemplate.cloneNode(true);
    cardProduct.classList.remove('card--in-stock');

    var classCardAmount = 'card--little';
    if (listProducts[i].amount === 0) {
      classCardAmount = 'card--soon';
    }
    if (listProducts[i].amount > 5) {
      classCardAmount = 'card--in-stock';
    }
    cardProduct.classList.add(classCardAmount);

    cardProduct.querySelector('.card__title').textContent = listProducts[i].name;
    cardProduct.querySelector('.card__img').src = listProducts[i].picture;
    cardProduct.querySelector('.card__price').innerHTML = (
      listProducts[i].price + '<span class="card__currency">₽</span><span class="card__weight">/' + listProducts[i].weight + 'Г</span>'
    );

    var starsRating = cardProduct.querySelector('.stars__rating');
    starsRating.textContent = 'Рейтинг: ' + listProducts[i].rating.value + ' звёзд';
    starsRating.classList.remove('stars__rating--five');
    starsRating.classList.add(classStarsRating[listProducts[i].rating.value - 1]);

    cardProduct.querySelector('.star__count').textContent = listProducts[i].rating.number;

    cardProduct.querySelector('.card__characteristic').textContent = listProducts[i].nutritionFacts.sugar
      ? 'Содержит сахар. ' + listProducts[i].nutritionFacts.energy + ' ккал'
      : 'Без сахара. ' + listProducts[i].nutritionFacts.energy + ' ккал';

    cardProduct.querySelector('.card__composition-list').innerHTML = listProducts[i].nutritionFacts.contents;

    catalogCards.appendChild(cardProduct);
  }
};

var renderBag = function () {

  var listBag = getList(getProduct, 3);

  var goodsCards = document.querySelector('.goods__cards');
  goodsCards.classList.remove('goods__cards--empty');

  var bagTemplate = document.querySelector('#card-order')
      .content
      .querySelector('.goods_card');

  for (var i = 0; i < 3; i++) {

    var bagProduct = bagTemplate.cloneNode(true);
    goodsCards.appendChild(bagProduct);

    bagProduct.querySelector('.card-order__title').textContent = listBag[i].name;
    bagProduct.querySelector('.card-order__img').src = listBag[i].picture;
    bagProduct.querySelector('.card-order__count').value = listBag[i].amount;
    bagProduct.querySelector('.card-order__price').innerHTML = listBag[i].price + ' ₽';
  }

  document.querySelector('.goods__card-empty').classList.add('visually-hidden');
};

renderProducts();

renderBag();

