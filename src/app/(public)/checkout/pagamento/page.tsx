'use client'

import CreditCardDialog from "@/components/Checkout/CreditCardDialog";
import PixDialog from "@/components/Checkout/PixDialog";
import { Config } from "@/types/config.type";
import useAPI from "@/utils/useAPI";
import useUser from "@/utils/useUser";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Pagamento = () => {
    const [isPaymentModalEnabled, setIsPaymentModalEnabled] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'CREDIT_CARD' | 'PIX' | null>(null)

    const { data: config } = useAPI<Config>('config');

    const router = useRouter()
    const { user } = useUser()

    return (
        <main className="w-full xl:w-[1200px] mx-auto pt-12 pb-56">
            <h4 className="text-3xl text-center font-semibold">Como deseja pagar?</h4>
            <div className="flex justify-center gap-4 mt-6">
                {config?.credit_card_enabled && (
                    <button 
                        className={`flex flex-col gap-4 items-center w-32 h-32 p-4 rounded-lg ${
                            paymentMethod === 'CREDIT_CARD'
                            ? 'border-2 border-[#572c88]'
                            : ''
                        }`}
                        onClick={() => setPaymentMethod('CREDIT_CARD')}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="58.542" height="38.527" viewBox="0 0 58.542 38.527">
                            <g id="Grupo_230" data-name="Grupo 230" transform="translate(-1558.706 -1260.848)">
                                <rect id="Retângulo_170" data-name="Retângulo 170" width="57.542" height="37.527" rx="1" transform="translate(1559.206 1261.348)" fill="none" stroke="#727272" stroke-miterlimit="10" stroke-width="1"/>
                                <rect id="Retângulo_171" data-name="Retângulo 171" width="57.542" height="7.505" transform="translate(1559.206 1268.853)" fill="none" stroke="#727272" stroke-miterlimit="10" stroke-width="1"/>
                                <line id="Linha_267" data-name="Linha 267" x2="10.007" transform="translate(1564.209 1288.868)" fill="none" stroke="#727272" stroke-miterlimit="10" stroke-width="1"/>
                                <line id="Linha_268" data-name="Linha 268" x2="7.505" transform="translate(1581.722 1288.868)" fill="none" stroke="#727272" stroke-miterlimit="10" stroke-width="1"/>
                            </g>
                        </svg>
                        <span className="text-neutral-500">
                            Cartão de crédito
                        </span>
                    </button>
                )}
                <button 
                    className={`flex flex-col gap-4 items-center w-32 h-32 p-4 rounded-lg ${
                        paymentMethod === 'PIX'
                        ? 'border-2 border-[#572c88]'
                        : ''
                    }`}
                    onClick={() => setPaymentMethod('PIX')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="40.79" height="40.789" viewBox="0 0 40.79 40.789">
                        <g id="Grupo_232" data-name="Grupo 232" transform="translate(-1745.043 -1262.272)">
                            <path id="Caminho_472" data-name="Caminho 472" d="M1776.574,1293.209a5.8,5.8,0,0,1-4.132-1.706l-5.969-5.972a1.133,1.133,0,0,0-1.568,0l-5.99,5.989a5.809,5.809,0,0,1-4.132,1.71h-1.169l7.564,7.564a6.052,6.052,0,0,0,8.549,0l7.578-7.58Z" fill="none" stroke="#727272" stroke-miterlimit="10" stroke-width="1"/>
                            <path id="Caminho_473" data-name="Caminho 473" d="M1754.784,1272.1a5.811,5.811,0,0,1,4.133,1.711l5.989,5.99a1.111,1.111,0,0,0,1.568,0l5.968-5.968a5.8,5.8,0,0,1,4.132-1.712h.719l-7.579-7.579a6.044,6.044,0,0,0-8.547,0h0l-7.552,7.558Z" fill="none" stroke="#727272" stroke-miterlimit="10" stroke-width="1"/>
                            <path id="Caminho_474" data-name="Caminho 474" d="M1783.562,1278.393l-4.58-4.58a.887.887,0,0,1-.325.065h-2.083a4.115,4.115,0,0,0-2.89,1.2l-5.968,5.964a2.867,2.867,0,0,1-4.051,0l-5.99-5.987a4.112,4.112,0,0,0-2.891-1.2h-2.556a.919.919,0,0,1-.308-.062l-4.609,4.6a6.051,6.051,0,0,0,0,8.548l4.6,4.6a.874.874,0,0,1,.308-.062h2.566a4.114,4.114,0,0,0,2.891-1.2l5.989-5.989a2.935,2.935,0,0,1,4.052,0l5.968,5.967a4.11,4.11,0,0,0,2.89,1.2h2.083a.866.866,0,0,1,.325.066l4.58-4.58a6.044,6.044,0,0,0,0-8.547h0" fill="none" stroke="#727272" stroke-miterlimit="10" stroke-width="1"/>
                        </g>
                    </svg>
                    <span className="text-neutral-500">
                        Pix
                    </span>
                </button>
            </div>
            <div className="flex justify-center mt-6">
                <button 
                    className={`bg-lime-600 enabled:hover:bg-lime-500 text-white px-16 py-2 rounded-full transition-colors disabled:cursor-not-allowed`}
                    disabled={!paymentMethod}
                    onClick={() => {
                        if (!user) {
                            return router.push('/signin?redirect=/checkout/pagamento')
                        }
                        
                        setIsPaymentModalEnabled(true)
                    }}
                >
                    Finalizar Pedido
                </button>
            </div>
            <CreditCardDialog 
                isOpen={isPaymentModalEnabled && paymentMethod === 'CREDIT_CARD'} 
                close={() => setIsPaymentModalEnabled(false)} 
            />
            <PixDialog 
                isOpen={isPaymentModalEnabled && paymentMethod === 'PIX'} 
                close={() => setIsPaymentModalEnabled(false)} 
            />
        </main>
    )
}

export default Pagamento