'use client';
import { NextPage } from 'next';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FileUploader } from 'react-drag-drop-files';
import { toast } from 'react-toastify';
import { object, string, number, date } from 'yup';

import Image from 'next/image';
import api from '@/utils/api';
import { AxiosError } from 'axios';
import Tiptap from '@/components/Tiptap';
import useAPI from '@/utils/useAPI';
import Dropzone from 'react-dropzone';

type Form = {
  name: string,
  price: number,
  categoryId: string,
  description: string,
  schedule: string,
  location: string,
  discount: number,
  image: File,
  banner: File,
}

const CreateProduct: NextPage = () => {
  const { register, handleSubmit, reset, setValue, watch } = useForm<Form>();

  const { data: categories } = useAPI<{ id: string, name: string }[]>('categories');

  const handleFormSubmit = async (data: any) => {
    if (!data.image) {
      toast.error('É obrigatório enviar uma imagem para o produto.');
      return;
    }

    if (!data.banner) {
      toast.error('É obrigatório enviar um banner para o produto.');
      return;
    }

    const productSchema = object({
      name: string()
        .nonNullable()
        .required('É obrigatório especificar um nome para o produto.'),
      price: number()
        .moreThan(0, 'O preço especificado deve ser maior que 0')
        .required('É obrigatório especificar um preço para o produto'),
      description: string()
        .nonNullable()
        .required('É obrigatório especificar um descrição para o produto.'),
      categoryId: string()
        .required('É obrigatório especificar a categoria do produto.'),
      schedule: string()
        .required('É obrigatório especificar um dia e horário do evento.'),
      location: string()
        .required('É obrigatório especificar um local para o evento.'),
    });

    
    try {
      const product = await productSchema.validate(data, { strict: true });
      if (isNaN(new Date(product.schedule).getTime())) {
        return toast.error('A data selecionada é inválida.')
      }

      const formdata = new FormData();

      const { image, banner, ...rest } = product as any;
      formdata.append('image', image);
      formdata.append('banner', banner);

      for (let key in rest) {
        formdata.append(key, (rest as any)[key]);
      }

      const { data: response } = await api.post('/products', formdata);
      toast.success(response.Message);
      reset();
    } catch (err: any) {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data.Message);
      } else {
        toast.error(err.message);
      }
    }
  };

  const descriptionValue = watch('description');

  return (
    <div className="bg-white shadow-md rounded-lg p-4 w-[500px] mx-auto">
      <h4>Criar novo produto</h4>
      <form className="mt-10" onSubmit={handleSubmit(handleFormSubmit)}>
        <Dropzone
          accept={{
            'image/png': [],
            'image/jpeg': [],
          }}
          onDrop={(accepted) => setValue('image', accepted[0])}
        >
          {({ getRootProps, getInputProps }) => (
            <div className="border border-gray-400 rounded-lg p-4 border-dashed text-xs" {...getRootProps()}>
              <input {...getInputProps()} />
              {watch('image') ? (
                <Image
                  src={URL.createObjectURL(watch('image'))}
                  alt=""
                  width={100}
                  height={100}
                />
              ) : (
                <>
                  <p className="text-gray-600">
                    Arraste e solte a imagem do produto aqui
                  </p>
                  <p className="mt-2 text-gray-400">Somente JPG ou PNG</p>
                </>
              )}
            </div>
          )}
        </Dropzone>
        <Dropzone
          accept={{
            'image/png': [],
            'image/jpeg': [],
          }}
          onDrop={(accepted) => setValue('banner', accepted[0])}
        >
          {({ getRootProps, getInputProps }) => (
            <div className="border border-gray-400 rounded-lg p-4 border-dashed text-xs mt-4" {...getRootProps()}>
              <input {...getInputProps()} />
              {watch('banner') ? (
                <Image
                  src={URL.createObjectURL(watch('banner'))}
                  alt=""
                  width={100}
                  height={100}
                />
              ) : (
                <>
                  <p className="text-gray-600">
                    Arraste e solte o banner do produto aqui
                  </p>
                  <p className="mt-2 text-gray-400">Somente JPG ou PNG</p>
                </>
              )}
            </div>
          )}
        </Dropzone>
        <div className="flex flex-col mt-4">
          <label className="text-xs mb-1">Nome do produto:</label>
          <input
            {...register('name')}
            type="text"
            className="border px-4 py-2 rounded-md"
            placeholder=""
          />
        </div>
        <div className="flex justify-between">
          <div className="flex flex-col mt-4">
            <label className="text-xs mb-1">Preço do produto:</label>
            <input
              id=""
              type="number"
              className="border px-4 py-2 rounded-md w-32"
              placeholder=""
              step=".01"
              {...register('price', {
                valueAsNumber: true,
              })}
            />
          </div>
          <div className="flex flex-col mt-4">
            <label className="text-xs mb-1">Desconto do produto:</label>
            <input
              id=""
              type="number"
              className="border px-4 py-2 rounded-md w-32"
              placeholder=""
              {...register('discount', {
                valueAsNumber: true,
              })}
            />
          </div>
        </div>
        <div className="flex flex-col mt-4">
            <label className="text-xs mb-1">Quando o evento vai acontecer:</label>
            <input
              id=""
              type="datetime-local"
              className="border px-4 py-2 rounded-md"
              placeholder=""
              {...register('schedule')}
            />
          </div>
        <div className="flex flex-col mt-4">
          <label className="text-xs mb-1">Local:</label>
          <input
            id=""
            className="border px-4 py-2 rounded-md"
            placeholder=""
            {...register('location')}
          />
        </div>
        <div className="flex flex-col mt-4">
          <label className="text-xs mb-1">Categoria:</label>
          <select
            className="border px-4 py-2 rounded-md bg-white"
            {...register('categoryId')}
          >
            {categories?.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col mt-4">
          <label className="text-xs mb-1">Descrição:</label>
          <Tiptap
            value={descriptionValue}
            onChange={(value: string) => setValue('description', value)}
          />
        </div>

        <div className="flex justify-end mt-5">
          <button
            type="submit"
            className="bg-secondary py-2 px-6 rounded-full font-bold"
          >
            Cadastrar
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProduct;
