'use client'
import { FloppyDisk, Plus, Trash } from "@/icons";
import api from "@/utils/api";
import useAPI from "@/utils/useAPI";
import { AxiosError } from "axios";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import { getIn, object, string } from 'yup';
import { Category } from "@/types/category.type";
import { DropResult, DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import Dropzone from "react-dropzone";
import CreateCategoryDialog from "@/components/Admin/CreateCategoryDialog";

type Form = {

}

const Categories: NextPage = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isAdittionMode, setIsAdittionMode] = useState(false);

    const { register, handleSubmit, reset, control } = useForm();

    const { data: categoriesData, mutate } = useAPI<Category[]>('/categories');

    const onSubmit = async (data: any) => {
        const categorySchema = object({
            name: string()
                .required('É obrigatório especificar um nome para a categoria.')
        });

        try {
            const category = await categorySchema.validate(data);
            const response = await api.post<{ Message: string }>('categories', category);

            mutate();
            reset();
            setIsAdittionMode(false);
            toast.success(response.data.Message);
        } catch (err: any) {
            const message = err instanceof AxiosError ?
                err.response?.data.Message :
                err.message;

            toast.error(message);
        }
    };

    const handleDeleteCategory = (categoryId: string) => {
        toast.promise(
            api.delete(`/categories/${categoryId}`).then(() => mutate()),
            {
                success: 'Categoria excluída com sucesso.',
                pending: 'Excluindo categoria...',
                error: 'Não foi possível deletar esta categoria.'
            }
        );

    };

    const handleCategoryDrop = (dropped: DropResult) => {
        if (!dropped.destination) return;

        const newItems = [...categories];
        const [item] = newItems.splice(dropped.source.index, 1);
        
        newItems.splice(dropped.destination.index, 0, item);

        setCategories(newItems);

        api.patch(
            `categories`, 
            {
                data: newItems.map((item, index) => ({ ...item, position: index }))
            }
        )
            .then(() => console.log('posições trocadas'));
    };

    useEffect(() => {
        if (categoriesData) {
            setCategories(categoriesData);
        }
    }, [categoriesData]);

    return (
        <div className="bg-white w-[500px] mx-auto shadow-md rounded-lg p-4">
            <h4>Categorias</h4>
            <DragDropContext onDragEnd={handleCategoryDrop}>
                <Droppable droppableId="categories-list">
                    {(provided) => (
                        <div ref={provided.innerRef} className="flex flex-col mt-4 min-h-[600px]" {...provided.droppableProps}>
                            {categories.map((category, index) => (
                                <Draggable
                                    key={category.id}
                                    draggableId={category.id}
                                    index={index}
                                >
                                    {(provided) => (
                                        <div
                                            className="bg-white my-2"
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                        >
                                            <div className="border rounded-lg w-full flex gap-2 p-2">
                                                <h5 className="flex-grow p-2">{category.name}</h5>
                                                <button
                                                    className="text-gray-600 hover:bg-gray-100 hover:text-red-500 p-2 rounded-md hover:opacity-80 transition-colors"
                                                    onClick={() => handleDeleteCategory(category.id)}
                                                >
                                                    <Trash size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
            <CreateCategoryDialog />
            {/* {!isAdittionMode && (
                <div className="flex justify-center mt-5">
                    <button
                        className="flex gap-3 items-center py-3 px-6 rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-colors"
                        onClick={() => {
                            setIsAdittionMode(true);
                        }}
                    >
                        <Plus />
                        Adicionar categoria
                    </button>
                </div>
            )} */}
            {/* {isAdittionMode && (
                <form className="mt-5" onSubmit={handleSubmit(onSubmit)}>
                    <h5 className="mb-2">Adicione uma nova categoria</h5>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs">Nome da categoria:</label>
                        <input
                            className="border rounded-md py-2 px-4 flex-grow"
                            {...register('name')}
                        />
                    </div>
                    <Controller 
                        control={control}
                        name="icon"
                        render={({ field }) => (
                            <Dropzone>
                                {({ getInputProps }) => (
                                    <div className="w-44 h-20 bg-gray-100">
                                        <input {...getInputProps({ onChange: field.onChange })} />

                                    </div>
                                )}
                            </Dropzone>
                        )}
                    />
                    <div className="flex justify-end gap-4">
                        <button 
                            type="button" 
                            className="bg-red-500 text-white px-4 py-2 rounded-lg"
                            onClick={() => {
                                reset();
                                setIsAdittionMode(false);
                            }}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="bg-secondary px-4 py-2rounded-md hover:opacity-80 rounded-lg"
                        >
                            Salvar
                        </button>
                        
                    </div>
                    
                </form>
            )} */}
        </div>
    )
};

export default Categories;