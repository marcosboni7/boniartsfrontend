const getBRL = (value: number) => {
  return value.toLocaleString('pt-br', {
    style: 'currency',
    currency: 'brl',
  });
};

export default getBRL;
