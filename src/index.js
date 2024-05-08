import 'babel-polyfill';
import './normalize.css';
import './bootstrap.min.css';
import './style.css';
import valid from 'card-validator';
import { el, setChildren } from 'redom';
import InputMask from 'inputmask';
import { checkCardNumber, checkCVV } from './modules/validations';
import validator from 'email-validator';
import PAYMENT from './assets/images/payment.svg';
import VISA from './assets/images/visa.svg';
import MASTERCARD from './assets/images/mastercard.svg';
import UNIONPAY from './assets/images/unionpay.svg';
import MIR from './assets/images/mir.svg';

const cardsList = Object.freeze({
  visa: VISA,
  mastercard: MASTERCARD,
  unionpay: UNIONPAY,
  mir: MIR,
});

function checkData() {
  const btn = document.querySelector('button');
  const validList = [...document.querySelectorAll('input')].map(
    (input) => input.value && !input.classList.contains('is-invalid'),
  );
  const isValidForm = validList.every((element) => element);
  btn.disabled = !isValidForm;
}

function createPaymentImages() {
  const images = [];
  for (const [key, cardSrc] of Object.entries(cardsList)) {
    const cardImg = el(`img#${key}.app__cardimg.mx-1`, { src: cardSrc });
    images.push(cardImg);
  }
  return images;
}

function checkPaymentSystem(value) {
  const digits = value.replace(' ', '');
  const imagesPayment = document.querySelectorAll('.app__cardimg');
  const numberValidation = valid.number(digits);
  if (numberValidation.card) {
    const cardName = numberValidation.card.type;
    [...imagesPayment].forEach((image) => {
      if (image.id !== cardName) {
        image.style.display = 'none';
      } else {
        image.style.display = 'inline-block';
      }
    });
  } else if (!numberValidation.card && !digits) {
    [...imagesPayment].forEach((image) => {
      image.style.display = 'inline-block';
    });
  }
}

export function createInput(
  nameClass,
  placeholder,
  name,
  type,
  mask,
  validation,
  checkSystem,
) {
  const input = el(`input.${nameClass}.form-control`, {
    placeholder,
    type,
    name,
    required: true,
    onblur: function handleBlur() {
      const validCard = validation(this.value);
      if (this.value) {
        if (validCard) {
          this.classList.add('is-valid');
          this.classList.remove('is-invalid');
        } else {
          this.classList.remove('is-valid');
          this.classList.add('is-invalid');
        }
      } else {
        this.classList.add('is-invalid');
      }
      checkData();
    },
    oninput: function handleInput() {
      if (checkSystem) {
        checkPaymentSystem(this.value);
      }
    },
  });
  InputMask(mask, { placeholder: '' }).mask(input);
  return input;
}

export function createApp() {
  const app = el('#app');
  const container = el('.container.d-flex.justify-content-center.py-4');
  const form = el('form.app__form.row.d-flex.flex-column');
  const card = el(
    '.app__card.row.d-flex.flex-column.bg-light.p-4.mb-4.rounded',
  );

  const row1 = el('.app__payment.row.d-flex.justify-content-between.mb-3');
  const paymentPicture = el('img.app__default', { src: PAYMENT });
  const payments = el('.app__payments');
  payments.append(...createPaymentImages());

  const row2 = el('.app__cardnum.row.mb-3');
  const cardNumber = createInput(
    'app__cardnumber',
    'Номер карты',
    'cardnumber',
    'text',
    '9{4} 9{4} 9{4} 9{4,6}',
    (x) => checkCardNumber(x),
    true,
  );

  const row3 = el('.app__cardinf.row.mb-3.d-flex.px-0');
  const col1 = el('.col-6');
  const col2 = el('.col-6');
  const cardDate = createInput(
    'app__date',
    'ММ/ГГ',
    'date',
    'text',
    '99/99',
    (x) => valid.expirationDate(x).isValid,
  );

  const cardCVC = createInput(
    'app__code',
    'CVV/CVC',
    'cvc-cvv',
    'password',
    '9{3}',
    (x) => checkCVV(x),
  );

  setChildren(col1, cardDate);
  setChildren(col2, cardCVC);

  const emailAdress = el('.app__adress.row.mb-4');
  const email = createInput(
    'app__emaie',
    'Email',
    'email',
    'text',
    'email',
    (x) => validator.validate(x),
  );

  const sendBtn = el('button.app__btn.btn.btn-success.row', 'Оплатить', {
    disabled: true,
  });

  setChildren(row1, paymentPicture, payments);
  setChildren(row2, cardNumber);
  setChildren(row3, col1, col2);
  setChildren(card, row1, row2, row3);
  setChildren(emailAdress, email);
  setChildren(form, card, emailAdress, sendBtn);
  setChildren(container, form);
  setChildren(app, container);
  setChildren(window.document.body, app);

  return {
    cardNumber,
    cardDate,
    cardCVC,
    email,
  };
}
