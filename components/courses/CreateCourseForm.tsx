"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import axios from 'axios'

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ComboBox } from "@/components/custom/Combox";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const formSchema = z.object({
  title: z.string().min(2, {
    message: 'Title is required and minimum 2 characters'
  }),
  categoryId:  z.string().min(1, {
    message: 'Category is required'
  }), 
  subCategoryId:  z.string().min(1, {
    message: 'SubCategory is required'
  }) 
});

interface CreateCourseFormProps {
    categories:{
        label: string
        value: string
        subCategories: {label: string, value: string}[]
    }[];
}

const CreateCourseForm = ({ categories }: CreateCourseFormProps) => {
    const router = useRouter()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          title: "",
          categoryId: "",

        },
      })

      const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try{
            const response = await axios.post("/api/courses", values)
            router.push(`/instructor/courses/${response.data.id}/basic`)
            toast.success('Novo Curso Criado!')
        } catch(err){
            console.log('Failed to create new course', err)
            toast.error('Algo deu errado')
        }
      }

    return (
        <div className='p-10'>
            <h1 className='text-xl font-bold'>Deixe-nos dar algumas noções básicas para o seu curso</h1>
            <p className='text-sm mt-3'>Não há problema se você não conseguir pensar em um bom título ou categoria correta, agora você pode alterá-la mais tarde </p>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-10">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Titulo</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Desenvolvimento web para iniciantes..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem className='flex flex-col'>
                <FormLabel>Categoria</FormLabel>
                <FormControl>
                    <ComboBox options={categories} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="subCategoryId"
            render={({ field }) => (
              <FormItem className='flex flex-col'>
                <FormLabel>SubCategoria</FormLabel>
                <FormControl>
                    <ComboBox options={
                        categories.find(
                            (category) =>
                                category.value === form.watch("categoryId")
                        )?.subCategories || []
                        } {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Criar Curso</Button>
        </form>
      </Form>
      </div>
    )
}

export default CreateCourseForm;