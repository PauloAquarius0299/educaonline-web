"use client"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Resource, Section } from '@prisma/client';
import { Button } from '@/components/ui/button';
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
import { useRouter } from 'next/navigation'
import SectionsList from "./SectionsList";
import { File, PlusCircle, X, Loader2 } from "lucide-react";
import FileUpload from "../custom/FileUpload";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name is required and must be at least 2 characters long",
  }),
  fileUrl: z.string().min(1, {
    message: 'File is required',
  })
});

interface ResourceFormProps {
  section: Section & { resources: Resource[] };
  courseId: string;
}

const ResourceForm = ({ section, courseId }: ResourceFormProps) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      fileUrl: '',
    },
  })

  const {isValid, isSubmitting} = form.formState;

  // Define a submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(
        `/api/courses/${courseId}/sections/${section.id}/resources`,
        values
      );
      toast.success("Recursos uploaded!");
      form.reset();
      router.refresh();
    } catch (err) {
      toast.error("Algo deu errado!");
      console.log("Failed to upload resource", err);
    }
  };

  const onDelete = async (id: string) => {
    try {
      await axios.post(
        `/api/courses/${courseId}/sections/${section.id}/resources/${id}`);
      toast.success("Recursos Deletados!");
      router.refresh();
    } catch (err) {
      toast.error("Algo deu errado!");
      console.log("Failed to delete resource", err);
    }
  };

  return (
    <>
      <div className='flex gap-2 items-center text-xl font-bold mt-12'>
        <PlusCircle />
        Add Recursos (optional)
      </div>
      <p className='text-sm font-medium mt-2'>
        Adicione um arquivo nessa seção que ajudam os estudantes a se preparar melhor.
      </p>

      <div className="mt-5 flex flex-col gap-5">
      {section.resources.map((resource) => (
       <div key={resource.id} className='flex justify-between bg-[#ebebff] rounded-lg text-sm font-medium p-3'>
        <div className='flex items-center'>
            <File className='h-4 w-4 mr-4' />
            {resource.name}
        </div>
        <button className='text-[#0e60cc]'
        disabled={isSubmitting}
        onClick={() => onDelete(resource.id)}
        >
            {isSubmitting ? (
                <Loader2 className='h-4 w-4 animate-spin' />
                ) : ( 
            <X className='h-4 w-4' />
                )}
        </button>
       </div>
      ))}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 my-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Arquivo</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Texto..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fileUrl"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Upload Arquivo</FormLabel>
                  <FormControl>
                    <FileUpload
                      value={field.value || ""}
                      onChange={(url) => field.onChange(url)}
                      endpoint='sectionResource'
                      page='Edit Section'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={!isValid || isSubmitting} >
                {isSubmitting ? (
                     <Loader2 className='h-4 w-4 animate-spin' />
               ) : ( 
                "Upload"
               )}
                </Button>
          </form>
        </Form>
      </div>
    </>
  )
}

export default ResourceForm;
