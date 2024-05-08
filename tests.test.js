import { checkCardNumber, checkCVV } from './src/modules/validations';
import { createApp } from './src/index';

test('Валидация номера карты пропускает корректный номер карты', () => {
  expect(checkCardNumber('4255190173385363')).toBe(true);
});

test('Валидация номера карты не пропускает произвольную строку, содержащую любые нецифровые символы. Для этого добавьте в валидируемую строку как минимум символы кириллицы, латиницы, знаки препинания.', () => {
  expect(checkCardNumber('4255dsa1901733853')).toBe(false);
  expect(checkCardNumber('42551l173l85363')).toBe(false);
  expect(checkCardNumber('425519/17,385363')).toBe(false);
});

test('Валидация номера карты не пропускает строку с недостаточным количеством цифр.', () => {
  expect(checkCardNumber('4255190173385')).toBe(false);
  expect(checkCardNumber('42551901733225')).toBe(false);
});

test('Валидация номера карты не пропускает строку со слишком большим количеством цифр (например, 25).', () => {
  expect(checkCardNumber('42551901733853634324')).toBe(false);
  expect(checkCardNumber('42551901733225434234543')).toBe(false);
});

test('Валидация CVV/CVC пропускает строку с тремя цифровыми символами.', () => {
  expect(checkCVV('351')).toBe(true);
  expect(checkCVV('400')).toBe(true);
});

test('Валидация CVV/CVC не пропускает строки с 1-2 цифровыми символами.', () => {
  expect(checkCVV('35')).toBe(false);
  expect(checkCVV('4')).toBe(false);
});

test('Валидация CVV/CVC не пропускает строки с 4+ цифровыми символами.', () => {
  expect(checkCVV('3523')).toBe(false);
  expect(checkCVV('3523543543')).toBe(false);
});

test('Валидация CVV/CVC не пропускает строки с тремя нецифровыми символами (латиница, кириллица и знаки препинания)', () => {
  expect(checkCVV('34f')).toBe(false);
  expect(checkCVV('ы23')).toBe(false);
  expect(checkCVV('1,3')).toBe(false);
});

test('Функция создания DOM-дерева должна вернуть DOM-элемент, в котором содержится строго четыре поля для ввода с плейсхолдерами «Номер карты», «ММ/ГГ», CVV/CVC, Email.', () => {
  const app = createApp();
  expect(app.cardNumber).toHaveProperty('placeholder', 'Номер карты');
  expect(app.cardDate).toHaveProperty('placeholder', 'ММ/ГГ');
  expect(app.cardCVC).toHaveProperty('placeholder', 'CVV/CVC');
  expect(app.email).toHaveProperty('placeholder', 'Email');
  expect(Object.keys(app).length).toBe(4);
});
