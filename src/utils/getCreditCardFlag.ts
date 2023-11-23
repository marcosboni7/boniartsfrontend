const flags_regex = {
  Visa: /^4[0-9]{12}(?:[0-9]{3})/,
  Mastercard: /^5[1-5][0-9]{14}/,
  Amex: /^3[47][0-9]{13}/,
  Elo: /^((((636368)|(438935)|(504175)|(451416)|(636297))\d{0,10})|((5067)|(4576)|(4011))\d{0,12})$/,
};

const flags = {
  Visa: '/flags/visa.svg',
  Mastercard: '/flags/mastercard.svg',
  Amex: '/flags/amex.svg',
  Elo: '/flags/elo.svg',
};

const getCreditCardFlag = (card_number: string) => {
  let flag: string = '';
  for (let brand in flags) {
    if (((flags_regex as any)[brand] as RegExp).test(card_number)) {
      flag = (flags as any)[brand];
      break;
    }
  }

  return flag;
};

export default getCreditCardFlag;
