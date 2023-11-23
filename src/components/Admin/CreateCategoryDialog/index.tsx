'use client'
import { Plus } from '@/icons'
import api from '@/utils/api';
import * as Dialog from '@radix-ui/react-dialog'
import { AxiosError } from 'axios';
import Dropzone from 'react-dropzone';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { object, string } from 'yup';

const CreateCategoryDialog = () => {
    const { register, handleSubmit, reset, setValue, watch } = useForm();

    const onSubmit = async (data: any) => {
        const categorySchema = object({
            name: string()
                .required('É obrigatório especificar um nome para a categoria.'),
            description: string()
                .required('É obrigatório especificar uma descrição para a categoria.')
        });

        console.log(data)

        try {
            const category = await categorySchema.validate(data);

            const formData = new FormData()
            formData.append('icon', data.icon)
            formData.append('banner', data.banner)
            formData.append('name', category.name)
            formData.append('description', category.description)

            const response = await api.post<{ Message: string }>('categories', formData)

            reset();
            toast.success(response.data.Message);
        } catch (err: any) {
            const message = err instanceof AxiosError ?
                err.response?.data.Message :
                err.message;

            toast.error(message);
        }
    };

    return (
        <Dialog.Root>
            <Dialog.Trigger asChild>
                <button
                    className="flex gap-3 items-center py-3 px-6 rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-colors"
                >
                    <Plus />
                    Adicionar categoria
                </button>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-gray-500/30 z-40" />
                <Dialog.Content className="fixed top-0 mt-32 left-1/2 -translate-x-1/2 w-[500px] bg-white p-4 rounded-xl z-40">
                    <form className="mt-5 space-y-4" onSubmit={handleSubmit(onSubmit)}>
                        <h5 className="mb-2">Adicione uma nova categoria</h5>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm">Nome da categoria:</label>
                            <input
                                className="border rounded-md py-2 px-4 flex-grow"
                                {...register('name')}
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm">Descrição da categoria:</label>
                            <textarea
                                rows={4}
                                className="border rounded-md py-2 px-4 flex-grow resize-none focus:outline-0"
                                {...register('description')}
                            />
                        </div>
                        <Dropzone onDrop={(accepted) => setValue('icon', accepted[0])}>
                            {({ getInputProps, getRootProps }) => (
                                <div 
                                    className="flex justify-center items-center w-full h-28 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg" 
                                    {...getRootProps()}
                                >
                                    <input {...getInputProps()} />
                                    <p className="text-sm text-gray-600">Arraste e solte o ícone da categoria</p>
                                </div>
                            )}
                        </Dropzone>
                        <Dropzone onDrop={(accepted) => setValue('banner', accepted[0])}>
                            {({ getInputProps, getRootProps }) => (
                                <div 
                                    className="flex justify-center items-center w-full h-28 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg" 
                                    {...getRootProps()}
                                >
                                    <input {...getInputProps()} />
                                    <p className="text-sm text-gray-600">Arraste e solte o banner da categoria</p>
                                </div>
                            )}
                        </Dropzone>
                        <div className="flex justify-end gap-4">
                            <Dialog.Close asChild>
                                <button 
                                    type="button" 
                                    className="bg-red-500 text-white px-4 py-2 rounded-lg"
                                    onClick={() => {
                                        reset();
                                    }}
                                >
                                    Cancelar
                                </button>
                            </Dialog.Close>
                            <button
                                type="submit"
                                className="bg-secondary px-4 py-2rounded-md hover:opacity-80 rounded-lg"
                            >
                                Salvar
                            </button>
                            
                        </div>
                        
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}

export default CreateCategoryDialog