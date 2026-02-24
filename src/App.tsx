/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Template } from './types';
import { FileUpload } from './components/FileUpload';
import { Dashboard } from './components/Dashboard';
import { Loader2 } from 'lucide-react';

const DATA_URL = 'https://script.google.com/macros/s/AKfycbxCQ7WwjmIH4YUnr0quWf97PlWC972eCHauPJPCEkoii320WZuiG4SyqKXIwTJtRRe2JQ/exec';

export default function App() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(DATA_URL);
        if (!response.ok) throw new Error('Network response was not ok');
        const jsonResponse = await response.json();
        
        // Handle both array response and object with records property
        const data = Array.isArray(jsonResponse) ? jsonResponse : (jsonResponse.records || []);
        
        const mappedTemplates = data.map((item: any, index: number) => ({
          id: `remote-${index}`,
          plantilla: item.Plantillas || item.plantilla || '',
          formato: item.formato || '',
          texto: item.texto || '',
          boton1: item['Boton 1'] || item.boton1 || '',
          boton2: item['Boton 2'] || item.boton2 || '',
          area: item['Área'] || item.area || '',
          tematica: item['Temática'] || item.tematica || '',
          topTema: item['Top tema'] || item.topTema || ''
        }));

        setTemplates(mappedTemplates);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('No se pudieron cargar los datos automáticamente. Puedes intentar subir un archivo Excel manualmente.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Cargando plantillas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {templates.length === 0 ? (
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="w-full max-w-3xl">
            {error && (
              <div className="mb-8 p-4 bg-amber-50 text-amber-800 rounded-xl border border-amber-200 text-center">
                {error}
              </div>
            )}
            <FileUpload onUploadSuccess={setTemplates} />
          </div>
        </div>
      ) : (
        <Dashboard templates={templates} />
      )}
    </div>
  );
}
