'use client';
import { NextPage } from 'next';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import { boolean, number, object } from 'yup';

import { Config } from '@/types/config.type';
import useAPI from '@/utils/useAPI';
import api from '@/utils/api';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';

const ServiceTax: NextPage = () => {
  const { data: config } = useAPI<Config>('config');
  const { data: status } = useAPI<{
    qrcode: string;
    connected: boolean;
    error: string;
    smartphoneConnected: boolean;
  }>('/whatsapp/status');
  const { register, handleSubmit, setValue } = useForm({
    defaultValues: {
      service_tax_percentage: 0,
      credit_card_enabled: true,
    }
  });

  const onSubmit = async (data: any) => {
    const configSchema = object({
      service_tax_percentage: number().required(
        'É obrigatório especificar a porcentagem da taxa'
      ),
      credit_card_enabled: boolean().required(
        'É obrigatório especificar se o cartão de crédito está ativado'
      ),
    });

    try {
      const config = await configSchema.validate(data);
      const response = await api.patch('/config', config);

      toast.success(response.data.Message);
    } catch (err: any) {
      const message =
        err instanceof AxiosError ? err.response?.data.Message : err.message;

      toast.error(message);
    }
  };

  useEffect(() => {
    if (config) {
      setValue('service_tax_percentage', config.service_tax_percentage);
      setValue('credit_card_enabled', config.credit_card_enabled);
    }
  }, [config]);

  return (
    <div className="p-4 w-[500px] mx-auto bg-white rounded-lg shadow-md">
      <h4 className="mb-5">Taxa de serviço</h4>
      {config?.whatsapp_id &&
        config?.whatsapp_token &&
        (!status?.connected ? (
          <>
            <Image
              src={status?.qrcode ?? ''}
              alt="qrcode"
              width={200}
              height={200}
              className="mx-auto"
            />
            <h5 className="text-red-500 font-bold mt-4 text-center text-lg">
              Desconectado
            </h5>
          </>
        ) : (
          <h5 className="text-green-500 font-bold mt-4 text-center text-lg">
            Conectado
          </h5>
        ))}
      {config?.whatsapp_id && config?.whatsapp_token && !status?.connected && (
        <p className="text-sm text-center mt-4">
          Você não está conectado. Escaneie o QR-CODE acima com o aplicativo do
          whatsapp para se conectar à API.
        </p>
      )}

      <form className="mt-10" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col">
          <label htmlFor="percentage" className="text-sm mb-1">
            Porcentagem da taxa
          </label>
          <input
            id="percentage"
            type="number"
            className="border rounded-lg py-2 px-4"
            {...register('service_tax_percentage', { valueAsNumber: true })}
          />
        </div>
        <div className="mt-4">
          <input 
            id="credit_card" 
            type="checkbox"
            {...register('credit_card_enabled', {})}
          />
          <label htmlFor='credit_card' className="ms-2">Ativar compras por cartão de crédito</label>
        </div>
        <div className="flex justify-end mt-4">
          <button
            type="submit"
            className="py-2 px-6 bg-secondary rounded-full text-white font-bold"
          >
            Salvar alterações
          </button>
        </div>
      </form>
    </div>
  );
};

export default ServiceTax;
