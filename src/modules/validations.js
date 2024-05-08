import valid from 'card-validator';

export function checkCardNumber(card) {
  return valid.number(card).isValid;
}

export function checkCVV(number) {
  return valid.cvv(number).isValid;
}
