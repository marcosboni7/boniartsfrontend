'use client';
import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FileUploader } from 'react-drag-drop-files';
import { toast } from 'react-toastify';
import { object, string, number } from 'yup';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import api from '@/utils/api';
import useAPI from '@/utils/useAPI';
import { AxiosError } from 'axios';

import 'react-quill/dist/quill.snow.css';
import dynamic from 'next/dynamic';
import { Product } from '@/types/product.type';
import Tiptap from '@/components/Tiptap';
import { Category } from '@/types/category.type';
import moment from 'moment';

const Quill = dynamic(() => import('react-quill'), {
  ssr: false,
});

type Form = {
  name: string,
  price: number,
  categoryId: string,
  description: string,
  schedule: string,
  location: string,
  discount: number,
}

const CreateProduct: NextPage = ({}) => {
  //const [image, setImage] = useState<File | null>(null);
  const { register, handleSubmit, reset, setValue, watch } = useForm<Form>();

  const params = useParams();

  const { data: product } = useAPI<Product>(`/products/${params.id}`);
  const { data: categories } = useAPI<Category[]>('categories');

  // const handleImageUpload = (image: File) => {
  //     setImage(image);
  // };

  const handleFormSubmit = async (data: any) => {

    // if (!image) {
    //     toast.error('É obrigatório especificar uma imagem para o produto.');
    //     return;
    // }

    const productSchema = object({
      name: string().required('É obrigatório especificar o nome do produto.'),
      price: number()
        .moreThan(0, 'O preço especificado deve ser maior que 0')
        .required('É obrigatório especificar o preço do produto.'),
      description: string()
        .nonNullable()
        .required('É obrigatório especificar a descrição do produto.'),
      categoryId: string()
        .nonNullable()
        .required('É obrigatório especificar a categoria do produto.')
    });

    try {
      const product = await productSchema.validate(data, { strict: true });
      const formdata = new FormData();

      //formdata.append('image', image);

      for (let key in product) {
        formdata.append(key, (product as any)[key]);
      }

      const { data: response } = await api.patch(
        `/products/${params.id}`,
        product
      );
      toast.success(response.Message);
    } catch (err: any) {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data.Message);
      } else {
        toast.error(err.message);
      }
    }
  };

  const descriptionValue = watch('description');

  useEffect(() => {
    if (product) {
      setValue('name', product.name);
      setValue('price', product.price);
      setValue('description', product.description);
      setValue('schedule', moment(product.schedule).format('YYYY-MM-DDTHH:mm'));
      setValue('location', product.location);
      setValue('discount', product.discount);
      setValue('categoryId', product.categoryId);
    }
  }, [product]);

  return (
    <div className="bg-white shadow-md rounded-lg p-4 w-[500px] mx-auto">
      <h4>Atualizar produto</h4>
      <form className="mt-10" onSubmit={handleSubmit(handleFormSubmit)}>
        {/* <FileUploader 
                    hoverTitle=""
                    handleChange={handleImageUpload}
                    types={['JPG', 'PNG']}
                >
                    <div className="border border-gray-400 rounded-lg p-4 border-dashed text-xs">
                        {image ? (
                            <Image src={URL.createObjectURL(image)} alt="" width={100} height={100} />
                        ) : (
                            <>
                                <p className="text-gray-600">Arraste e solte a imagem do produto aqui</p>
                                <p className="mt-2 text-gray-400">Somente JPG ou PNG</p>
                            </>
                        )}
                    </div>
                </FileUploader> */}
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
              <option key={category.id} value={category.id}>{category.name}</option>
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

        <div className="flex justify-center mt-5">
          <button type="submit" className="bg-secondary py-2 px-6 rounded-full">
            Cadastrar
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProduct;
