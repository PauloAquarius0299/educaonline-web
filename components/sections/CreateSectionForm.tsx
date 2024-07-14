"use client"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import {Course, Section} from '@prisma/client';
import { Button} from '@/components/ui/button';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
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
import toast from "react-hot-toast";
import axios from 'axios'
import {useRouter} from 'next/navigation'
import SectionsList from "./SectionsList";

const formSchema = z.object({
    title: z.string().min(2, {
        message: "Title is required and must be at least 2 characters long",
      }),
  })

const CreateSectionForm = ({course}: {course: Course & {sections: Section[]}}) => {
    const pathname = usePathname();
    const router = useRouter()
    const routes = [
        {
          label: "Informações",
          path: `/instructor/courses/${course.id}/basic`,
        },
        { label: "Curriculo", path: `/instructor/courses/${course.id}/sections` },
      ];

      const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          title: "",
        },
      })
     
      // 2. Define a submit handler.
      const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
          const response = await axios.post(
            `/api/courses/${course.id}/sections`,
            values
          );
          router.push(
            `/instructor/courses/${course.id}/sections/${response.data.id}`
          );
          toast.success("Nova Seção Criada!");
        } catch (err) {
          toast.error("Algo deu errado!");
          console.log("Failed to create a new section", err);
        }
      };

      const onReorder = async (updateData: {id: string; position: number }[]) => {
        try {
          await axios.put(
            `/api/courses/${course.id}/sections/reorder`, {
            list: updateData,
        });
          toast.success("Seção organizada com sucesso!");
        } catch (err) {
          toast.error("Algo deu errado!");
          console.log("Failed to create a new section", err);
        }
      }

    return (
        <div className='px-10 py-6'>
        <div className='flex gap-5'>
        {routes.map((route) => (
          <Link key={route.path} href={route.path} className='flex gap-4'><Button variant={pathname === route.path ? "default" : 'outline'}>{route.label}</Button> </Link>
        ))}
      </div>
      <SectionsList 
      items={course.sections || []} 
      onReorder={onReorder}
      onEdit={(id) => router.push(`/instructor/courses/${course.id}/sections/${id}`)}
      />
      <h1 className='text-xl font-bold mt-5'>Add Nova Seção</h1>
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-5">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titulo</FormLabel>
              <FormControl>
                <Input placeholder="Ex Apresentação..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <div className='flex gap-5'>
       <Link href={`/instructor/courses/${course.id}/basic`}><Button variant='outline' type='button' >Cancelar</Button></Link> 
         <Button type="submit">Salvar</Button>
      </div>
     
        
      </form>
    </Form>
    </div>
    )
}

export default CreateSectionForm;