'use client';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { NextPage } from 'next';

import { object, string } from 'yup';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';

import api from '@/utils/api';
import useAPI from '@/utils/useAPI';
import { Config } from '@/types/config.type';

const Pix: NextPage = () => {
  const { data: config } = useAPI<Config>('config');
  const { register, handleSubmit, setValue } = useForm({
    defaultValues: {
      pix_name: config?.pix_name,
      pix_key: config?.pix_key,
    },
  });

  const onSubmit = async (data: any) => {
    const pixSchema = object({
      pix_key: string().required('É obrigatório especificar uma chave pix.'),
      pix_name: string()
        .matches(
          /^[A-Za-z\s]+$/,
          'São apenas permitidas letras e espaços no nome do pix.'
        )
        .required('É obrigatório especificar um nome.'),
    });

    try {
      const pix = await pixSchema.validate(data);
      const response = await api.patch<{ Message: string }>(`/config`, pix);

      toast.success(response.data.Message);
    } catch (err: any) {
      const message =
        err instanceof AxiosError ? err.response?.data.Message : err.message;

      toast.error(message);
    }
  };

  useEffect(() => {
    if (config) {
      setValue('pix_key', config.pix_key);
      setValue('pix_name', config.pix_name);
    }
  }, [config]);

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h4>Configurações do PIX</h4>
      <form
        className="flex flex-col gap-4 w-[500px] mt-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col">
          <label htmlFor="pix_name" className="text-xs mb-2">
            Nome:
          </label>
          <input
            id="pix_name"
            type="text"
            className="px-4 py-2 border rounded-md"
            {...register('pix_name')}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="pix_key" className="text-xs mb-2">
            Chave pix:
          </label>
          <input
            {...register('pix_key')}
            id="pix_key"
            type="text"
            className="px-4 py-2 border rounded-md"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-secondary rounded-lg px-6 py-2 text-white font-bold hover:opacity-80 transition-all"
          >
            Salvar configurações
          </button>
        </div>
      </form>
    </div>
  );
};

export default Pix;
