'use client';
import { NextPage } from 'next';
import { useState } from 'react';
import { Plus, FloppyDisk, Trash } from '@/icons';
import { useForm } from 'react-hook-form';
import { object, string } from 'yup';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import api from '@/utils/api';
import useAPI from '@/utils/useAPI';

const Pixel: NextPage = () => {
  const { data: pixels, mutate } =
    useAPI<{ id: string; token: string }[]>('/pixels');

  const [isAdittionMode, setIsAdittionMode] = useState(false);
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data: any) => {
    const pixelSchema = object({
      token: string()
        .required('É obrigatório especificar um pixel.')
        .nonNullable(),
    });

    try {
      const pixel = await pixelSchema.validate(data);
      const response = await api.post('/pixels', pixel);
      mutate();
      toast.success(response.data.Message);
    } catch (err: any) {
      const message =
        err instanceof AxiosError ? err.response?.data.Message : err.message;

      toast.error(message);
    }
  };

  const handleDeletePixel = async (pixelId: string) => {
    toast.promise(
      api.delete(`pixels/${pixelId}`).then(() => {
        mutate();
      }),
      {
        success: 'Pixel deletado com sucesso.',
        error: 'Não foi possível excluir este pixel.',
        pending: 'Excluindo pixel...',
      }
    );
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md w-[500px]">
      <h4 className="mb-4">Gerenciar Pixels</h4>
      <div>
        {pixels?.map((pixel) => (
          <div key={pixel.id} className="flex flex-col gap-1">
            <label className="text-xs">Pixel ID:</label>
            <div className="flex gap-2">
              <input
                className="border rounded-md py-2 px-4"
                value={pixel.token}
                readOnly
              />
              <button
                className="bg-red-500 text-white px-3 rounded-md hover:opacity-80"
                onClick={() => handleDeletePixel(pixel.id)}
              >
                <Trash />
              </button>
            </div>
          </div>
        ))}
        {!isAdittionMode && (
          <div className="flex justify-center mt-5">
            <button
              className="flex gap-3 items-center py-3 px-6 rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-colors"
              onClick={() => {
                setIsAdittionMode(true);
              }}
            >
              <Plus />
              Adicionar pixel
            </button>
          </div>
        )}
      </div>
      {isAdittionMode && (
        <form className="mt-5" onSubmit={handleSubmit(onSubmit)}>
          <h5 className="mb-2">Adicione um novo pixel</h5>
          <div className="flex flex-col gap-1">
            <label className="text-xs">Pixel ID:</label>
            <div className="flex gap-2">
              <input
                className="border rounded-md py-2 px-4 flex-grow"
                {...register('token')}
              />
              <button
                type="submit"
                className="bg-secondary px-3 rounded-md hover:opacity-80"
              >
                <FloppyDisk />
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default Pixel;
