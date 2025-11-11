import { AlertCircle } from "lucide-react";

interface ErrorDisplayProps {
  message: string;
}

/**
 * Componente para mostrar mensajes de error
 * Se utiliza cuando ocurre algún problema al cargar o procesar datos
 */
export default function ErrorDisplay({ message }: ErrorDisplayProps) {
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-start">
      <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
      <div>
        <p className="font-medium">Error</p>
        <p className="text-sm">{message}</p>
      </div>
    </div>
  );
}
