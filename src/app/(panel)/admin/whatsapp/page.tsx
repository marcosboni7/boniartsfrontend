'use client';
import { NextPage } from 'next';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import { object, string } from 'yup';

import { Config } from '@/types/config.type';
import useAPI from '@/utils/useAPI';
import api from '@/utils/api';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';

const Whatsapp: NextPage = () => {
  const { data: config } = useAPI<Config>('config');
  const { data: status } = useAPI<{
    qrcode: string;
    connected: boolean;
    error: string;
    smartphoneConnected: boolean;
  }>('/whatsapp/status');
  const { register, handleSubmit, setValue } = useForm();

  const onSubmit = async (data: any) => {
    const configSchema = object({
      whatsapp_id: string().required(
        'É obrigatório especificar o id da instancia do whatsapp'
      ),
      whatsapp_token: string().required(
        'É obrigatório especificar o token da instancia do whatsapp'
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
      setValue('whatsapp_id', config.whatsapp_id);
      setValue('whatsapp_token', config.whatsapp_token);
    }
  }, [config]);

  return (
    <div className="p-4 w-[500px] mx-auto bg-white rounded-lg shadow-md">
      <h4 className="mb-5">API whatsapp</h4>
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
          <label htmlFor="whatsapp_id" className="text-xs mb-1">
            ID da instancia do whatsapp:
          </label>
          <input
            id="whatsapp_id"
            type="text"
            className="border rounded-lg py-2 px-4"
            {...register('whatsapp_id')}
          />
        </div>
        <div className="flex flex-col mt-5">
          <label htmlFor="whatsapp_token" className="text-xs mb-1">
            Token da instancia do whatsapp:
          </label>
          <input
            id="whatsapp_token"
            type="text"
            className="border rounded-lg py-2 px-4"
            {...register('whatsapp_token')}
          />
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

export default Whatsapp;
