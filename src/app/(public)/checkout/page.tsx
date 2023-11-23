'use client';
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { FC } from 'react';
import Image from 'next/image';

import api from '@/utils/api';
import getBRL from '@/utils/getBRL';
import useAPI from '@/utils/useAPI';

import { Product } from '@/types/product.type';

import CheckoutForm from '@/components/Checkout/Form';

const Checkout: FC = () => {
  const { data: cart } = useAPI<{ id: string, amount: number, product: Product }[]>('/carts');
  const router = useRouter();

  if (cart?.length === 0) {
    router.push('/cart');
    return <></>;
  }

  return (
    <main className="w-[1200px] mx-auto">
      
    </main>
  );
};

export default Checkout;
