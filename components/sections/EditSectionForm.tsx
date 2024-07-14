"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Section,  MuxData, Resource } from "@prisma/client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import RichEditor from "@/components/custom/RichEditor";
import { Switch } from "@/components/ui/switch";
import FileUpload from "../custom/FileUpload";
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ArrowLeft, Loader2, Trash } from "lucide-react";
import ResourceForm from "./ResourceForm";
import MuxPlayer from '@mux/mux-player-react'
import Delete from "../custom/Delete";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title is required and must be at least 2 characters long",
  }),
  description: z.string().optional(),
  videoUrl: z.string().optional(),
  isFree: z.boolean().optional(),
});


interface EditSectionFormProps {
  section: Section & { resources: Resource[]; muxData?: MuxData | null };
  courseId: string; 
  isCompleted: boolean;
}

const EditSectionForm = ({section, courseId, isCompleted}: EditSectionFormProps) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: section.title,
      description: section.description || "",
      videoUrl: section.videoUrl || '',
      isFree: section.isFree,
    },
  });

  const { isValid, isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(
        `/api/courses/${courseId}/sections/${section.id}`,
        values
      );
      toast.success("Seção Salva!");
      router.refresh();
    } catch (err) {
      console.log("Failed to update the section", err);
      toast.error("Algo deu errado!");
    }
  };

  return (
    <>
      <div className='flex flex-col gap-2 sm:flex-row sm:justify-between mb-7'>
        <Link href={`/instructor/courses/${courseId}/sections`}>
          <Button variant='outline' className='font-medium text-sm'>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Curriculo
          </Button>
        </Link>
        <div className='flex gap-4 items-start'>
          <Button variant='outline'>Publicar</Button>
          <Delete item='section' courseId={courseId} sectionId={section.id} />
        </div>
      </div>
      <h1 className='text-xl font-bold'>Detalhes da Seção</h1>
      <p className='text-sm font-medium mt-2'>
        Complete essa seção com detalhes, informação, um bom vídeo e tarefas que você vai ensinar, para que seus estudantes tenham uma ótima experiência de aprendizado.
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-5">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Introdução do seu curso..." {...field} />
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
          {section.videoUrl && (
            <div className="my-5">
              <MuxPlayer
                playbackId={section.muxData?.playbackId || ""}
                className="md:max-w-[600px]"
              />
            </div>
          )}
          <FormField
            control={form.control}
            name="videoUrl"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Vídeo do Curso</FormLabel>
                <FormControl>
                <FileUpload
                    value={field.value || ""}
                    onChange={(url) => field.onChange(url)}
                    endpoint="sectionVideo"
                    page="Edit Section"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isFree"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Acessibilidade</FormLabel>
                  <FormDescription>
                    Qualquer um pode acessar essa seção gratuita.</FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="flex gap-5">
            <Link href={`/instructor/courses/${courseId}/sections`}>
              <Button variant="outline" type="button">
                Cancelar
              </Button>
            </Link>
            <Button type="submit" disabled={!isValid || isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Salvar"
              )}
            </Button>
          </div>
        </form>
      </Form>

      <ResourceForm section={section} courseId={courseId} />
    </>
  );
};

export default EditSectionForm;