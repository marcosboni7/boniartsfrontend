'use client'
import { Config } from '@/types/config.type';
import { Product } from '@/types/product.type';
import api from '@/utils/api';
import getBRL from '@/utils/getBRL';
import getPriceWithDiscount from '@/utils/getPriceWithDiscount';
import { getTaxPrice } from '@/utils/getTaxPrice';
import useAPI from '@/utils/useAPI';
import useUser from '@/utils/useUser';
import { FloppyDisk } from '@phosphor-icons/react';
import * as Dialog from '@radix-ui/react-dialog'
import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-toastify';

const PixDialog = ({
    isOpen,
    close,
}: { 
    isOpen: boolean,
    close: () => void,
}) => {
    const [items, setItems] = useState<
        { id: string; product: Product; amount: number }[]
    >([])
    const { data: cartData, mutate } = useAPI<
        { id: string; product: Product; amount: number }[] | undefined
    >(`carts`)
    const { data: pixPaymentData } = useAPI<{
        data: {
            qrcode: string,
            copiaECola: string,
        }
    }>(`/carts/payment`, {
        revalidateOnFocus: false,
    });
    const { data: config } = useAPI<Config>('config');


    const { user } = useUser()

    const copiaEColaRef = useRef<HTMLInputElement | null>(null)

    const handleSubmit = async () => {
        if (!user) {
            return toast.error('Ocorreu um erro ao processar o checkout, faça login.');
        }

        const response = await api.post('products/purchase', {
            personal_data: {
              phone: user.phone,
              name: user.name,
            },
            paymentType: 'PIX',
            cart: [],
        });

        toast.success('Compra finalizada com sucesso.');
        setTimeout(() => {
          window.location.href = '/';
        }, 1000);
    }
    
    const getTotalPrice = () => {
        let total_price: number = 0
        items?.forEach(({ product, amount }) => {
            //const item_price = item.product.price

            total_price += getPriceWithDiscount(product.price, product.discount) * amount
        })

        return total_price
    }

    const totalPrice = useMemo(getTotalPrice, [items])

    useEffect(() => {
        if (cartData) setItems(cartData)
    }, [cartData])

    return (
        <Dialog.Root open={isOpen}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed grid place-items-center inset-0 bg-gray-500/30 z-40 overflow-y-auto">
                    <Dialog.Content className="flex-shrink-0 top-0 mt-0 lg:mt-8 w-full sm:w-[600px] bg-white p-4 rounded-xl space-y-4">
                        <h4 className="text-xl text-center">Pagamento por PIX</h4>
                        <hr />
                        <div className="flex justify-between">
                            <span>Valor:</span>
                            <span>{getBRL(totalPrice + getTaxPrice(totalPrice, config?.service_tax_percentage ?? 0))}</span>
                        </div>
                        <hr />
                        <div className="space-y-3">
                            <p className="text-center">1- Acesse o app do seu banco ou instituição financeira</p>
                            <p className="text-center">2- Escolhar pagar via pix e escaneie o código abaixo</p>
                            <p className="text-center">3- Confirme as informações e finalize a compra</p>
                            <Image
                                src={pixPaymentData?.data.qrcode ?? ''}
                                alt=""
                                width={300}
                                height={300}
                                className='mx-auto'
                            />
                        </div>
                        <hr />
                        <p className="text-center">ou copie o código abaixo e insira na área Pix Copia e Cola</p>
                        <div className="flex gap-2">
                            <input 
                                ref={copiaEColaRef}
                                className="flex-grow border border-gray-400 py-1 px-2 rounded-md" 
                                value={pixPaymentData?.data.copiaECola ?? ''}
                            />
                            <button 
                                className="bg-blue-400 px-3 text-white rounded-md"
                                onClick={
                                    () => {
                                        if (copiaEColaRef.current) {
                                            window.navigator.clipboard.writeText(copiaEColaRef.current.value)
                                            toast.success('Código copiado com sucesso')

                                        }
                                    }
                                }
                            >
                                <FloppyDisk />
                            </button>
                        </div>
                        <div className="flex justify-end gap-4">
                            <button 
                                className="py-2 px-4 hover:bg-gray-100 text-red-500"
                                onClick={() => close()}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="bg-[#572c88] text-white hover:opacity-70 py-2 px-6 rounded-lg transition-all self-end"
                                onClick={() => handleSubmit()}
                            >
                                Finalizar compra
                            </button>
                        </div>
                    </Dialog.Content>
                </Dialog.Overlay>
            </Dialog.Portal>
        </Dialog.Root>
    )
}

export default PixDialog