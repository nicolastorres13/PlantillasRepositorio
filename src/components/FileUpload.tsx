import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, AlertCircle } from 'lucide-react';
import { parseExcel } from '../utils/excel';
import { Template } from '../types';

interface FileUploadProps {
  onUploadSuccess: (templates: Template[]) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onUploadSuccess }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.name.match(/\.(xlsx|xls|csv)$/)) {
      setError('Por favor sube un archivo Excel válido (.xlsx, .xls, .csv)');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const templates = await parseExcel(file);
      if (templates.length === 0) {
        setError('El archivo parece estar vacío o no tiene el formato correcto.');
      } else {
        onUploadSuccess(templates);
      }
    } catch (err) {
      setError('Hubo un error al procesar el archivo. Verifica el formato e intenta de nuevo.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full max-w-3xl mx-auto p-6">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">Explorador de Plantillas</h1>
        <p className="text-lg text-slate-600">Sube tu archivo Excel para filtrar y visualizar tus plantillas de comunicación.</p>
      </div>

      <div
        className={`w-full p-12 border-2 border-dashed rounded-2xl transition-all duration-200 ease-in-out flex flex-col items-center justify-center cursor-pointer
          ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 bg-white hover:border-indigo-400 hover:bg-slate-50'}
        `}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={onChange}
          accept=".xlsx, .xls, .csv"
          className="hidden"
        />
        
        <div className="bg-indigo-100 p-4 rounded-full mb-6">
          <UploadCloud className="w-10 h-10 text-indigo-600" />
        </div>
        
        <h3 className="text-xl font-semibold text-slate-800 mb-2">
          {isLoading ? 'Procesando archivo...' : 'Arrastra y suelta tu archivo Excel aquí'}
        </h3>
        <p className="text-slate-500 mb-6 text-center max-w-md">
          O haz clic para explorar en tus carpetas. Soporta archivos .xlsx, .xls y .csv
        </p>
        
        <button 
          className="px-6 py-3 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition-colors"
          disabled={isLoading}
        >
          Seleccionar Archivo
        </button>
      </div>

      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 w-full">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
            <FileText className="w-5 h-5 text-emerald-600" />
          </div>
          <h4 className="font-semibold text-slate-900 mb-2">Formato Requerido</h4>
          <p className="text-sm text-slate-600">El archivo debe contener columnas como: Plantillas, Formato, Texto, Botón 1, Botón 2, Área, Temática, Top Tema.</p>
        </div>
      </div>
    </div>
  );
};
