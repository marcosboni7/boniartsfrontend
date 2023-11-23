'use client'
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination } from "swiper/modules"
import Dropzone from 'react-dropzone';
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import { Plus, PlusCircle, Trash } from "@/icons"
import { useForm } from "react-hook-form";
import Image from "next/image";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import api from "@/utils/api";
import useAPI from "@/utils/useAPI";
import { Banner } from "@/types/banner.type";

type Form = {
    image: File,
    title: string,
    url: string,
    schedule: string,
    location: string,
}

const Banners = () => {
    const { data: banners, mutate } = useAPI<Banner[]>(`/banners`);

    const { 
        register, 
        handleSubmit, 
        setValue, 
        watch, 
        reset 
    } = useForm<Form>({

    });

    const uploadedImage = watch('image');

    const onFilesAccept = (acceptedFiles: File[]) => {
        setValue('image', acceptedFiles[0])
    }

    const deleteBanner = async (id: string) => {
        try {
            await api.delete(`/banners/${id}`)
            toast.success('Banner excluído com sucesso.')
            mutate()
        } catch (err) {}
    }

    const onSubmit = async (data: Form) => {
        try {
            const formdata = new FormData();
            formdata.append('image', data.image);

            const { image, ...rest } = data;

            for (let key in rest) {
                formdata.append(key, (rest as any)[key]);
            }
        
            const { data: response } = await api.post('/banners', formdata);
            toast.success(response.Message);
            reset();
            mutate()
        } catch (err: any) {
            if (err instanceof AxiosError) {
                toast.error(err.response?.data.Message);
            } else {
                toast.error(err.message);
            }
        }
    }

    return (
        <div className="p-4 bg-white rounded-lg shadow-md">
            <h4>Banners da home</h4>
            <Swiper
                spaceBetween={32}
                className="w-[720px] h-80 !mx-0 mt-4 rounded-xl overflow-hidden"
                modules={[Navigation, Pagination]}
                navigation
                pagination={{
                    el: '.slider-bullets'
                }}
            >
                {banners?.map((banner) => (
                    <SwiperSlide key={banner.id} className="relative">
                        <button
                            className="absolute right-0 top-0 bg-red-500 text-white p-2 rounded-lg"
                            onClick={() => deleteBanner(banner.id)}
                        >
                            <Trash size={24} />
                        </button>
                        <Image 
                            src={`${api.defaults.baseURL}/uploads/${banner.image}`}
                            alt="Banner" 
                            width={720}
                            height={320}
                        />
                    </SwiperSlide>
                ))}
                <SwiperSlide >
                    <Dropzone onDrop={onFilesAccept}>
                        {({ getRootProps, getInputProps }) => (
                            <div
                                className="flex flex-col justify-center items-center bg-gray-100 h-full "
                                {...getRootProps()}
                            >
                                <input {...getInputProps()} />
                                {uploadedImage ? (
                                    <Image 
                                        src={URL.createObjectURL(uploadedImage)} 
                                        alt="Banner" 
                                        width={720}
                                        height={320}
                                    />
                                ) : (
                                    <>
                                        <PlusCircle size={64} className="text-gray-500" />
                                        <p className="text-gray-500 mt-2">Adicionar novo banner</p>
                                    </>
                                )}
                            </div>
                        )}
                    </Dropzone>
                </SwiperSlide>
            </Swiper>
            <div className="slider-bullets flex justify-center !w-[720px] gap-1 mt-2"></div>
            {uploadedImage && (
                <form className="w-[500px] mt-4" onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col mt-4">
                        <label className="text-sm mb-1">Título:</label>
                        <input
                            id=""
                            className="border px-4 py-2 rounded-md"
                            placeholder=""
                            {...register('title')}
                        />
                    </div>
                    <div className="flex flex-col mt-4">
                        <label className="text-sm mb-1">Local:</label>
                        <input
                            id=""
                            className="border px-4 py-2 rounded-md"
                            placeholder=""
                            {...register('location')}
                        />
                    </div>
                    <div className="flex flex-col mt-4">
                        <label className="text-sm mb-1">Horário (opcional):</label>
                        <input
                            id=""
                            className="border px-4 py-2 rounded-md"
                            placeholder=""
                            type="datetime-local"
                            {...register('schedule')}
                        />
                    </div>
                    <div className="flex flex-col mt-4">
                        <label className="text-sm mb-1">URL:</label>
                        <input
                            id=""
                            className="border px-4 py-2 rounded-md"
                            placeholder=""
                            {...register('url')}
                        />
                    </div>
                    <div className="flex justify-end mt-5">
                        <button
                            type="submit"
                            className="bg-secondary py-2 px-6 rounded-full font-bold"
                        >
                            Criar banner
                        </button>
                    </div>
                </form>
            )}
        </div>
    )
}

export default Banners