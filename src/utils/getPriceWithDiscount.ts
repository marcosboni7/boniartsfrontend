const getPriceWithDiscount = (price: number, discount: number) => {
    const priceWithDiscount =
      discount > 0
        ? price - price * (discount / 100)
        : price

    return priceWithDiscount
}

export default getPriceWithDiscount