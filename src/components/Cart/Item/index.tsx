import { useState, type FC, useEffect, useMemo } from 'react';

import Image from 'next/image';

import { CaretLeft, CaretRight, X } from '@/icons';

import api from '@/utils/api';
import getBRL from '@/utils/getBRL';

import { Product } from '@/types/product.type';

type Props = {
  item: {
    id: string;
    product: Product;
    amount: number;
  };
  onAmountChange: (productId: number, newAmount: number) => void;
  onProductRemove: (productId: string) => void;
};

const CartItem: FC<Props> = ({ item, onAmountChange, onProductRemove }) => {
  const [amount, setAmount] = useState<number>(item.amount);

  const handleAmountIncrement = () => {
    setAmount((old) => old + 1);
  };

  const handleAmountDecrement = () => {
    setAmount((old) => (old - 1 < 1 ? 1 : old - 1));
  };

  const handleProductRemove = (productId: string) => {
    onProductRemove(productId);
  };

  const totalPrice = useMemo(() => {
    const total = item.product.price * amount;

    return total;
  }, [amount]);

  useEffect(() => {
    onAmountChange(item.product.id, amount);
  }, [amount]);

  return (
    <tr>
      <td className="leading-3 py-4 text-xs">{item.product.name}</td>
      <td className="text-center py-4">
        <div className="flex items-center justify-center gap-2 h-full">
          <button
            type="button"
            className="rounded-full p-2 hover:bg-gray-200 transition-colors"
            onClick={handleAmountDecrement}
          >
            <CaretLeft />
          </button>
          {amount}
          <button
            type="button"
            className="rounded-full p-2 hover:bg-gray-200 transition-colors"
            onClick={handleAmountIncrement}
          >
            <CaretRight />
          </button>
        </div>
      </td>
      <td className="text-center w-32 px-4">{getBRL(totalPrice)}</td>
      <td className="text-center w-10">
        <button
          className="hover:bg-gray-100 text-neutral-600 hover:text-red-500 p-2 rounded-md transition-colors"
          onClick={() => handleProductRemove(item.id)}
        >
          <X size={20} />
        </button>
      </td>
    </tr>
  );
};

export default CartItem;
