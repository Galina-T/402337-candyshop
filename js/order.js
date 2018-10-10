'use strict';
(function () {
  var HIDDEN = 'visually-hidden';

  // заблокировать и разблокировать форму
  var sectionBuy = document.querySelector('.buy');
  var sectionBuyForm = sectionBuy.querySelector('form');
  var inputsForm = sectionBuyForm.querySelectorAll('input');
  var buySubmitBtn = document.querySelector('.buy__submit-btn');

  var getRemoveDisable = function (element) {
    for (var i = 0; i < element.length; i++) {
      element[i].removeAttribute('disabled');
    }
  };

  window.getSetDisable = function (element) {
    for (var i = 0; i < element.length; i++) {
      element[i].setAttribute('disabled', 'disable');
    }
  };

  window.getSetDisable(inputsForm);
  buySubmitBtn.setAttribute('disabled', 'disable');
  //

  // ПЕРЕКЛЮЧЕНИЕ ВКЛАДОК

  var paymentInner = document.querySelector('.payment__inner');
  var paymentInputs = document.querySelector('.payment__inputs');

  paymentInner.addEventListener('click', function (evt) {

    if (evt.target.getAttribute('for') === 'payment__card') {

      evt.currentTarget.querySelector('.payment__card-wrap').classList.remove(HIDDEN);
      evt.currentTarget.querySelector('.payment__cash-wrap').classList.add(HIDDEN);
      getRemoveDisable(paymentInputs.querySelectorAll('input'));
    }
    if (evt.target.getAttribute('for') === 'payment__cash') {

      evt.currentTarget.querySelector('.payment__cash-wrap').classList.remove(HIDDEN);
      evt.currentTarget.querySelector('.payment__card-wrap').classList.add(HIDDEN);
      window.getSetDisable(paymentInputs.querySelectorAll('input'));
    }
  });

  // ДОСТАВКА

  var deliver = document.querySelector('.deliver');
  var deliverStores = deliver.querySelector('.deliver__stores');
  var deliverEntry = deliver.querySelector('.deliver__entry-fields-wrap');

  deliver.addEventListener('click', function (evt) {

    if (evt.target.getAttribute('for') === 'deliver__store') {
      evt.currentTarget.querySelector('.deliver__store').classList.remove(HIDDEN);
      evt.currentTarget.querySelector('.deliver__courier').classList.add(HIDDEN);
      deliverEntry.setAttribute('disabled', 'disable');
      deliverStores.removeAttribute('disabled');
    }
    if (evt.target.getAttribute('for') === 'deliver__courier') {
      evt.currentTarget.querySelector('.deliver__courier').classList.remove(HIDDEN);
      evt.currentTarget.querySelector('.deliver__store').classList.add(HIDDEN);
      deliverStores.setAttribute('disabled', 'disable');
      deliverEntry.removeAttribute('disabled');
    }
  });

  // ВЫБОР МЕТРО

  var deliverStoreItem = document.querySelectorAll('.deliver__store-item');
  var deliverStoreMapImg = document.querySelector('.deliver__store-map-img');

  deliverStoreItem.forEach(function (element) {
    element.addEventListener('click', function (evt) {
      deliverStoreMapImg.alt = evt.target.textContent;
      deliverStoreMapImg.src = 'img/map/' + evt.target.getAttribute('for').split('-')[1] + '.jpg';
    });
  });

  // Валидация

  // Банковская карта

  // алгоритм Луна

  var getValidityLuhn = function (cardNumber) {
    var arr = cardNumber.split('').map(function (char, index) {
      var digit = parseInt(char, 10);

      if ((index + cardNumber.length) % 2 === 0) {
        var digitX2 = digit * 2;

        return digitX2 > 9 ? digitX2 - 9 : digitX2;
      }
      return digit;
    });

    return !(arr.reduce(function (a, b) {
      return a + b;
    }, 0) % 10);
  };

  var paymentCardNumberInput = document.querySelector('#payment__card-number');

  paymentCardNumberInput.addEventListener('input', function (evt) {
    if (getValidityLuhn(evt.target.value) === false) {
      evt.target.setCustomValidity('Проверьте номер карты');
    } else {
      evt.target.setCustomValidity('');
    }
  });

  // paymentCardNumberInput.addEventListener('invalid', function (evt) {
  //   if (paymentCardNumberInput.validity.patternMismatch) {
  //     paymentCardNumberInput.setCustomValidity('Введите данные в формате XXXX XXXX XXXX XXXX');
  //   } else {
  //     paymentCardNumberInput.setCustomValidity('');
  //   }
  // });

  var paymentCardStatus = document.querySelector('.payment__card-status');

  var paymentInputsList = paymentInputs.querySelectorAll('input');

  for (var i = 0; i < paymentInputsList.length; i++) {
    // paymentInputsList[i].addEventListener('invalid', function (evt) {
    //   evt.currentTarget.setCustomValidity('Проверьте данные');
    // });

    paymentInputsList[i].addEventListener('blur', function (evt) {
      // if (evt.currentTarget.validity.valid === false) {
      //   evt.currentTarget.setCustomValidity('Проверьте данные');
      //   // var a = evt.currentTarget.checkValidity();
      //   // console.log(a);
      //   // return;
      // }
      var resultValidity = 0;
      for (var j = 0; j < paymentInputsList.length; j++) {
        if (paymentInputsList[j].validity.valid === true) {
          resultValidity++;
        }
      }
      if (resultValidity === paymentInputsList.length) {
        paymentCardStatus.textContent = 'Одобрен';
      } else {
        paymentCardStatus.textContent = 'не определён';
      }
    });
  }
  window.order = {
    inputsForm: inputsForm,
    buySubmitBtn: buySubmitBtn
  };

})();

// // Отправляем форму
// sectionBuyForm.addEventListener('sabmit', function (evt) {
//   evt.preventDefault();
// });

// // проверка для всей формы

// function CustomValidation() {
//   // Установим пустой массив сообщений об ошибках
//   this.invalidities = [];
// }

// CustomValidation.prototype = {
//   // Метод, проверяющий валидность
//   checkValidity: function (input) {

//     var validity = input.validity;

//     if (validity.tooLong) {
//       var maxlength = input.getAttribute('maxlength');
//       this.addInvalidity('Максимальная длина ' + maxlength);
//     }

//     if (validity.tooShort) {
//       var minlength = input.getAttribute('minlength');
//       this.addInvalidity('Минимальная длина ' + minlength);
//     }
//     // И остальные проверки валидности...
//   },

//   // Добавляем сообщение об ошибке в массив ошибок
//   addInvalidity: function (message) {
//     this.invalidities.push(message);
//   },

//   // Получаем общий текст сообщений об ошибках
//   getInvalidities: function () {
//     return this.invalidities.join('. \n');
//   }
// };

// // Добавляем обработчик клика на кнопку отправки формы
// buySubmitBtn.addEventListener('click', function (evt) {
//   // Пройдёмся по всем полям
//   for (var i = 0; i < paymentInputsList.length; i++) {

//     var input = paymentInputsList[i];

//     // Проверим валидность поля, используя встроенную в JavaScript функцию checkValidity()
//     if (input.checkValidity() === false) {

//       var inputCustomValidation = new CustomValidation(); // Создадим объект CustomValidation
//       inputCustomValidation.checkValidity(input); // Выявим ошибки
//       var customValidityMessage = inputCustomValidation.getInvalidities(); // Получим все сообщения об ошибках
//       input.setCustomValidity(customValidityMessage); // Установим специальное сообщение об ошибке

//     } // закончился if
//   } // закончился цикл
// });

