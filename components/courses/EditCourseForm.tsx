"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Course } from "@prisma/client";

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
import RichEditor from "@/components/custom/RichEditor";
import { ComboBox } from "@/components/custom/Combox";
import FileUpload from "../custom/FileUpload";
import Link from 'next/link'
import axios from 'axios'
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Loader2, Trash } from "lucide-react";

const formSchema = z.object({
    title: z.string().min(2, {
      message: "Title is required and must be at least 2 characters long",
    }),
    subtitle: z.string().optional(),
    description: z.string().optional(),
    categoryId: z.string().min(1, {
      message: "Category is required",
    }),
    subCategoryId: z.string().min(1, {
      message: "Subcategory is required",
    }),
    levelId: z.string().optional(),
    imageUrl: z.string().optional(),
    price: z.coerce.number().optional(),
  });
  

interface EditCourseFormProps{
    course: Course;
    categories:{
      label: string;
      value: string;
      subCategories: {label: string, value: string}[];
  }[];
  levels: { label: string; value: string }[];
}

const EditCourseForm = ({course, categories, levels}: EditCourseFormProps) => {
  const router = useRouter()
  const pathname = usePathname()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          title: course.title,
          subtitle: course.subtitle || "",
          description: course.description || "",
          categoryId: course.categoryId,
          subCategoryId: course.subCategoryId,
          levelId: course.levelId || "",
          imageUrl: course.imageUrl || "",
          price: course.price || undefined,
        },
      });

      const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try{
             await axios.patch(`/api/courses/${course.id}`, values)
            toast.success('Curso Atualizado!')
            router.refresh()
        } catch(err){
            console.log('Failed to create new course', err)
            toast.error('Algo deu errado')
        }
      }

      const routes = [
        {
          label: "Informações",
          path: `/instructor/courses/${course.id}/basic`,
        },
        { label: "Curriculo", path: `/instructor/courses/${course.id}/sections` },
      ]

  return (
    <>
    <div className='flex flex-col gap-2 sm:flex-row sm:justify-between mb-7'>
      <div className='flex gap-5'>
        {routes.map((route) => (
          <Link key={route.path} href={route.path} className='flex gap-4'><Button variant={pathname === route.path ? "default" : 'outline'}>{route.label}</Button> </Link>
        ))}
      </div>

      <div className='flex gap-4 items-start'>
        <Button variant='outline'>Publicar</Button>
        <Button className='bg-red-500 hover:bg-red-700'><Trash /></Button>
      </div>
    </div>
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
        name="subtitle"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Subtitulo</FormLabel>
            <FormControl>
              <Input placeholder="Ex: Se torne um desenvolvedor Back-End só com um curso. Java, Sprint Bot, PostgreSQL, database e mais!" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
       <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Detalhes</FormLabel>
            <FormControl>
              <RichEditor placeholder="O que esse curso tem a oferecer?" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className='flex flex-wrap gap-10'>
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
           <FormField
              control={form.control}
              name="levelId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>
                    Nivel <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <ComboBox options={levels} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             
      </div>
      <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>
                 Banner do Curso
                  </FormLabel>
                  <FormControl>
                   <FileUpload
                   value={field.value || ""}
                   onChange={(url) => field.onChange(url)}
                   endpoint='courseBanner'
                   />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

      <FormField
        control={form.control}
        name="price"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Preço Mensal</FormLabel>
            <FormControl>
              <Input 
              type='number'
              step='0.01'
              placeholder="29,99" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className='flex gap-5'>
       <Link href="/instructor/courses"><Button variant='outline' type='button' >Cancelar</Button></Link> 
         <Button type="submit">Salvar</Button>
      </div>
     
    </form>
  </Form>
  </>
  )
}

export default EditCourseForm