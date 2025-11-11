/**
 * Componente simple de indicador de carga
 * Muestra un spinner animado para indicar que hay una operación en progreso
 */
export default function LoadingIndicator() {
  return (
    <div className="flex justify-center items-center p-4">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      <span className="ml-2 text-sm text-gray-600">Cargando...</span>
    </div>
  );
}
