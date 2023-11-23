'use client'
import { Eye, Trash, X } from "@/icons";
import api from "@/utils/api";
import getBRL from "@/utils/getBRL";
import useAPI from "@/utils/useAPI";
import { Modal } from "@mui/material";
import moment from "moment";
import { NextPage } from "next";
import { useState } from "react";
import { toast } from "react-toastify";

import { Payment } from "@/types/payment.type";
import { Purchase } from "@/types/purchase.type";


const Payments: NextPage = () => {
    const [detailsPaymentId, setDetailsPaymentId] = useState<string | null>(null);
    const [showTrashModal, setShowTrashModal] = useState(false);

    const { data: payments, mutate: mutatePayments } = useAPI<(Payment & { purchases: Purchase[] })[]>('payments');
    const { data: deletedPayments, mutate: mutateDeletedPayments } = useAPI<Payment[]>('payments/deleted');

    const handlePaymentDelete = (paymentId: string) => {
        toast.promise(
            api.delete(`/payments/${paymentId}/delete`)
            .then(() => {
                mutatePayments();
                mutateDeletedPayments();
            }),
            {
                success: 'Registro de pagamento deletado com sucesso.',
                pending: 'Deletando pagamento...',
                error: 'Não foi possível deletar o registro do pagamento.'
            }
        );
    };

    const handleReset = () => {
        toast.promise(
            api.delete(`/payments/reset`).then(() => mutatePayments()),
            {
                success: 'Resetando todos os registros de pagamento.',
                pending: 'Resetando pagamentos...',
                error: 'Não foi possível resetar os pagamentos.'
            }
        );
    };

    const openDetailsModal = (paymentId: string) => {
        setDetailsPaymentId(paymentId);
    };

    const closeDetailsModal = () => {
        setDetailsPaymentId(null);
    };

    const openTrashModal = () => {
        setShowTrashModal(true);
    };

    const closeTrashModal = () => {
        setShowTrashModal(false);
    };

    // const getPriceWithDiscount = (price: number, discount: number) => {
    //     return price - (
    //             price * (discount / 100)
    //         );
    // };

    return (
        <div className="bg-white shadow-md rounded-lg p-4">
            <div className="flex justify-between">
                <h4>Pagamentos realizados</h4>
                <div className="flex gap-3">
                    <button
                        className="hover:bg-gray-100 text-neutral-600 hover:text-red-500 p-2 rounded-md transition-colors"
                        title="Lixeira"
                        onClick={openTrashModal}
                    >
                        <Trash size={30} />
                    </button>
                    <button
                        type="button"
                        className="py-2 px-6 bg-red-500 hover:bg-red-600 border border-red-400 rounded-md text-white font-bold "
                        onClick={handleReset}
                    >
                        Resetar pagamentos
                    </button>
                </div>
            </div>
            <table className="table-fixed w-full mt-5">
                <thead>
                    <tr>
                        <th className="text-gray-500 font-normal text-start py-2">Email</th>
                        <th className="text-gray-500 font-normal text-start py-2">Preço</th>
                        <th className="text-gray-500 font-normal text-start py-2">
                            Data e hora
                        </th>
                        <th className="text-gray-500 font-normal text-start py-2">Ações</th>
                    </tr>
                </thead>
                <tbody>
                {payments?.map((payment) => (
                    <tr key={payment.id} className="even:bg-gray-50">
                        <td className="py-2">{payment.userEmail}</td>
                        <td className="py-2">{getBRL(payment.price)}</td>
                        <td className="py-2">
                            {moment(payment.createdAt).format('DD/MM/YYYY hh:mm:ss')}
                        </td>
                        <td className="py-2">
                            <button
                                className="hover:bg-gray-100 text-neutral-600 hover:text-blue-500 p-2 rounded-md transition-colors"
                                onClick={() => openDetailsModal(payment.id)}
                            >
                                <Eye size={20} />
                            </button>
                            <button
                                className="hover:bg-gray-100 text-neutral-600 hover:text-red-500 p-2 rounded-md transition-colors"
                                onClick={() => handlePaymentDelete(payment.id)}
                            >
                                <Trash size={20} />
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            {!!detailsPaymentId && (
                <Modal open={true} onClose={closeDetailsModal}>
                    <div className="bg-white w-full lg:w-[700px] mt-[300px] mx-auto p-4">
                        <div className="flex justify-end">
                            <button
                                className="hover:bg-gray-100 text-neutral-600 hover:text-red-500 p-2 rounded-md transition-colors"
                                onClick={closeDetailsModal}
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <h4>Detalhes da compra</h4>
                        <table className="w-full mt-8">
                            <thead>
                                <tr>
                                    <th className="text-sm font-normal text-start">Nome</th>
                                    <th className="text-sm font-normal">Quantidade</th>
                                    <th className="text-sm font-normal">Preço unitário</th>
                                    <th className="text-sm font-normal">Valor total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments
                                ?.filter(({ id }) => id === detailsPaymentId)[0]
                                .purchases
                                ?.map((purchase) => (
                                    <tr key={purchase.id}>
                                        <td className="text-xs py-3">{purchase.product.name}</td>
                                        <td className="text-center py-3">{purchase.amount}</td>
                                        <td className="text-center py-3">{getBRL(purchase.product.price)}</td>
                                        <td className="text-center py-3">
                                            {getBRL(purchase.product.price)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Modal>
            )}

            <Modal open={showTrashModal} onClose={closeTrashModal}>
                <div className="bg-white w-full lg:w-[700px] mt-[300px] mx-auto p-4">
                    <h4>Lixeira</h4>
                    <table className="table-fixed w-full mt-5">
                        <thead>
                            <tr>
                                <th className="text-gray-500 font-normal text-start py-2">Email</th>
                                <th className="text-gray-500 font-normal text-center py-2">Preço</th>
                                <th className="text-gray-500 font-normal text-start py-2">
                                    Data e hora
                                </th>
                                <th className="text-gray-500 font-normal text-start py-2">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                        {deletedPayments?.map((payment) => (
                            <tr key={payment.id} className="even:bg-gray-50">
                                <td className="py-2">{payment.userEmail}</td>
                                <td className="py-2 text-center">{getBRL(payment.price)}</td>
                                <td className="py-2">
                                    {moment(payment.createdAt).format('DD/MM/YYYY hh:mm:ss')}
                                </td>
                                <td className="py-2">
                                    <button
                                        className="hover:bg-gray-100 text-neutral-600 hover:text-red-500 p-2 rounded-md transition-colors"
                                        onClick={() => handlePaymentDelete(payment.id)}
                                    >
                                        <Trash size={20} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </Modal>
        </div>
    );
};

export default Payments;