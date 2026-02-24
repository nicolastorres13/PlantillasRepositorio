import React, { useState, useMemo } from 'react';
import { Template, Filters } from '../types';
import { Sidebar } from './Sidebar';
import { StatsPanel } from './StatsPanel';
import { TemplateCard } from './TemplateCard';
import { LayoutGrid, List, SearchX, Menu, X } from 'lucide-react';

interface DashboardProps {
  templates: Template[];
}

export const Dashboard: React.FC<DashboardProps> = ({ templates }) => {
  const [filters, setFilters] = useState<Filters>({
    plantillas: [],
    formatos: [],
    texto: '',
    hasBoton1: null,
    hasBoton2: null,
    areas: [],
    tematicas: [],
    topTemas: [],
  });

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const filteredTemplates = useMemo(() => {
    return templates.filter(t => {
      if (filters.plantillas.length > 0 && !filters.plantillas.includes(t.plantilla)) return false;
      if (filters.formatos.length > 0 && !filters.formatos.includes(t.formato)) return false;
      if (filters.areas.length > 0 && !filters.areas.includes(t.area)) return false;
      if (filters.tematicas.length > 0 && !filters.tematicas.includes(t.tematica)) return false;
      if (filters.topTemas.length > 0 && !filters.topTemas.includes(t.topTema)) return false;
      
      if (filters.texto && !t.texto.toLowerCase().includes(filters.texto.toLowerCase()) && !t.plantilla.toLowerCase().includes(filters.texto.toLowerCase())) return false;
      
      if (filters.hasBoton1 === true && !t.boton1) return false;
      if (filters.hasBoton1 === false && t.boton1) return false;
      
      if (filters.hasBoton2 === true && !t.boton2) return false;
      if (filters.hasBoton2 === false && t.boton2) return false;

      return true;
    });
  }, [templates, filters]);

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-slate-50 overflow-hidden relative">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed lg:static inset-y-0 left-0 z-50 w-80 lg:w-72 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="h-full bg-white flex flex-col">
          <div className="lg:hidden flex items-center justify-between p-4 border-b border-slate-200">
            <h2 className="font-semibold text-lg text-slate-900">Filtros</h2>
            <button onClick={() => setIsSidebarOpen(false)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <Sidebar templates={templates} filters={filters} setFilters={setFilters} />
          </div>
        </div>
      </div>
      
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 custom-scrollbar w-full">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Directorio de Plantillas</h1>
                <p className="text-sm sm:text-base text-slate-500 mt-1">Mostrando {filteredTemplates.length} de {templates.length} plantillas</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-slate-200 shadow-sm self-start sm:self-auto">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-slate-100 text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                title="Vista de Cuadrícula"
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-slate-100 text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                title="Vista de Lista"
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </header>

          <StatsPanel templates={filteredTemplates} />

          {filteredTemplates.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white rounded-2xl border border-slate-200 border-dashed">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                <SearchX className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No se encontraron plantillas</h3>
              <p className="text-slate-500 max-w-md">
                No hay plantillas que coincidan con los filtros seleccionados. Intenta ajustar o limpiar los filtros para ver más resultados.
              </p>
              <button 
                onClick={() => setFilters({
                  plantillas: [], formatos: [], texto: '', hasBoton1: null, hasBoton2: null, areas: [], tematicas: [], topTemas: []
                })}
                className="mt-6 px-6 py-2.5 bg-indigo-50 text-indigo-600 font-medium rounded-xl hover:bg-indigo-100 transition-colors"
              >
                Limpiar Filtros
              </button>
            </div>
          ) : (
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
              {filteredTemplates.map(template => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
