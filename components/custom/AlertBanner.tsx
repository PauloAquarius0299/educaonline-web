import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Rocket, TriangleAlert } from "lucide-react";

interface AlertBannerProps{
    isCompleted: boolean;
    requiredFieldsCount: number;
    missingFieldsCount: number;
}

const AlertBanner = ({isCompleted, requiredFieldsCount, missingFieldsCount}: AlertBannerProps ) => {
  return (
    <Alert className="my-4" variant={`${isCompleted ? 'complete' : 'destructive'}`}>
        {isCompleted ? (
            <Rocket className="h-4 w-4" />
        ) : (
            <TriangleAlert className="h-4 w-4" />
        )
          }
  <AlertTitle className="text-sm font-medium" >
    {missingFieldsCount} missing Fields(s) / {requiredFieldsCount} required field(s)
  </AlertTitle>
  <AlertDescription className="text-xs">
   {isCompleted ? 
  'Bom trabalho! Pronto para publicar': "Você só poderá publicar quando todos os campos obrigatórios estiverem preenchidos"}
  </AlertDescription>
</Alert>

  )
}

export default AlertBanner;