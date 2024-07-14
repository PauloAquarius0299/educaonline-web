import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import axios from "axios";
import { Loader2, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../ui/button";

interface DeleteProps {
  item: string;
  courseId: string;
  sectionId?: string;
}

const Delete = ({ item, courseId, sectionId }: DeleteProps) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const onDelete = async () => {
    try {
      setIsDeleting(true);
      const url =
        item === "course"
          ? `/api/courses/${courseId}`
          : `/api/courses/${courseId}/sections/${sectionId}`;
      await axios.delete(url);

      setIsDeleting(false);
      const pushedUrl =
        item === "course"
          ? "/instructor/courses"
          : `/instructor/courses/${courseId}/sections`;
      router.push(pushedUrl);
      router.refresh();
      toast.success(`${item} deletado!`);
    } catch (err) {
      toast.error(`algo deu errado!`);
      console.log(`Failed to delete the ${item}`, err);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button>
          {isDeleting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash className="h-4 w-4" />
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-500">
            Voce Tem Certeza?
          </AlertDialogTitle>
          <AlertDialogDescription>
          Essa ação não pode ser desfeita. Isso excluirá permanentemente 
          {item}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction className="bg-[#0e60cc]" onClick={onDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Delete;