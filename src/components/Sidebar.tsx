import React, { useMemo } from 'react';
import { Filters, Template } from '../types';
import { Search, Filter, Check, X } from 'lucide-react';

interface SidebarProps {
  templates: Template[];
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}

export const Sidebar: React.FC<SidebarProps> = ({ templates, filters, setFilters }) => {
  // Extract unique values for filters
  const uniqueValues = useMemo(() => {
    const getUnique = (key: keyof Template) => {
      const values = templates.map(t => t[key]).filter(Boolean);
      return Array.from(new Set(values)).sort();
    };

    return {
      plantillas: getUnique('plantilla'),
      formatos: getUnique('formato'),
      areas: getUnique('area'),
      tematicas: getUnique('tematica'),
      topTemas: getUnique('topTema'),
    };
  }, [templates]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, texto: e.target.value }));
  };

  const toggleFilter = (key: keyof Filters, value: string) => {
    setFilters(prev => {
      const current = prev[key] as string[];
      if (current.includes(value)) {
        return { ...prev, [key]: current.filter(v => v !== value) };
      } else {
        return { ...prev, [key]: [...current, value] };
      }
    });
  };

  const toggleBooleanFilter = (key: 'hasBoton1' | 'hasBoton2') => {
    setFilters(prev => {
      const current = prev[key];
      let next: boolean | null = null;
      if (current === null) next = true;
      else if (current === true) next = false;
      else next = null;
      return { ...prev, [key]: next };
    });
  };

  const clearFilters = () => {
    setFilters({
      plantillas: [],
      formatos: [],
      texto: '',
      hasBoton1: null,
      hasBoton2: null,
      areas: [],
      tematicas: [],
      topTemas: [],
    });
  };

  const activeFilterCount = 
    filters.plantillas.length + 
    filters.formatos.length + 
    filters.areas.length + 
    filters.tematicas.length + 
    filters.topTemas.length + 
    (filters.texto ? 1 : 0) + 
    (filters.hasBoton1 !== null ? 1 : 0) + 
    (filters.hasBoton2 !== null ? 1 : 0);

  const FilterSection = ({ title, items, filterKey }: { title: string, items: string[], filterKey: keyof Filters }) => {
    if (items.length === 0) return null;
    const selectedItems = filters[filterKey] as string[];
    
    return (
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-slate-900 mb-3 uppercase tracking-wider">{title}</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
          {items.map(item => (
            <label key={item} className="flex items-start gap-3 cursor-pointer group" onClick={() => toggleFilter(filterKey, item)}>
              <div className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors
                ${selectedItems.includes(item) ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 bg-white group-hover:border-indigo-400'}
              `}>
                {selectedItems.includes(item) && <Check className="w-3.5 h-3.5 text-white" />}
              </div>
              <span className="text-sm text-slate-700 group-hover:text-slate-900 break-words">{item}</span>
            </label>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full lg:w-72 flex-shrink-0 bg-white border-r border-slate-200 h-full overflow-y-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-slate-900">
          <Filter className="w-5 h-5" />
          <h2 className="font-semibold text-lg">Filtros</h2>
        </div>
        {activeFilterCount > 0 && (
          <button 
            onClick={clearFilters}
            className="text-xs font-medium text-slate-500 hover:text-indigo-600 flex items-center gap-1 transition-colors"
          >
            <X className="w-3 h-3" /> Limpiar ({activeFilterCount})
          </button>
        )}
      </div>

      <div className="mb-8">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Buscar en texto..." 
            value={filters.texto}
            onChange={handleTextChange}
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-sm font-semibold text-slate-900 mb-3 uppercase tracking-wider">Botones</h3>
        <div className="space-y-3">
          <button 
            onClick={() => toggleBooleanFilter('hasBoton1')}
            className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-colors border flex justify-between items-center
              ${filters.hasBoton1 === true ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 
                filters.hasBoton1 === false ? 'bg-red-50 border-red-200 text-red-700' : 
                'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}
          >
            <span>Botón 1</span>
            <span className="text-xs font-medium">
              {filters.hasBoton1 === true ? 'Sí' : filters.hasBoton1 === false ? 'No' : 'Todos'}
            </span>
          </button>
          
          <button 
            onClick={() => toggleBooleanFilter('hasBoton2')}
            className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-colors border flex justify-between items-center
              ${filters.hasBoton2 === true ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 
                filters.hasBoton2 === false ? 'bg-red-50 border-red-200 text-red-700' : 
                'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}
          >
            <span>Botón 2</span>
            <span className="text-xs font-medium">
              {filters.hasBoton2 === true ? 'Sí' : filters.hasBoton2 === false ? 'No' : 'Todos'}
            </span>
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <FilterSection title="Tipo de Plantilla" items={uniqueValues.plantillas} filterKey="plantillas" />
        <FilterSection title="Formato" items={uniqueValues.formatos} filterKey="formatos" />
        <FilterSection title="Área" items={uniqueValues.areas} filterKey="areas" />
        <FilterSection title="Temática" items={uniqueValues.tematicas} filterKey="tematicas" />
        <FilterSection title="Top Tema" items={uniqueValues.topTemas} filterKey="topTemas" />
      </div>
    </div>
  );
};
