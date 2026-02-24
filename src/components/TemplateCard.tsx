import React from 'react';
import { Template } from '../types';
import { FileText, LayoutTemplate, MousePointerClick, Tag, MapPin } from 'lucide-react';

interface TemplateCardProps {
  template: Template;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({ template }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col h-full">
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex flex-col items-start mb-4 gap-2">
          <h3 className="text-sm font-bold text-slate-900 leading-snug break-words w-full">
            {template.plantilla || 'Sin Nombre'}
          </h3>
          {template.topTema && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-medium bg-amber-100 text-amber-800 max-w-full text-center leading-tight">
              <span className="truncate">{template.topTema}</span>
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {template.formato && (
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-md max-w-full">
              <LayoutTemplate className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{template.formato}</span>
            </div>
          )}
          {template.area && (
            <div className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md max-w-full">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{template.area}</span>
            </div>
          )}
          {template.tematica && (
            <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md max-w-full">
              <Tag className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{template.tematica}</span>
            </div>
          )}
        </div>

        <div className="flex-1 mb-6">
          <div className="flex items-start gap-2 mb-2">
            <FileText className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
            <h4 className="text-sm font-semibold text-slate-700">Texto de la Plantilla</h4>
          </div>
          <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-600 whitespace-pre-wrap break-words border border-slate-100 max-h-48 overflow-y-auto custom-scrollbar leading-relaxed">
            {template.texto || <span className="italic text-slate-400">Sin texto disponible</span>}
          </div>
        </div>

        {(template.boton1 || template.boton2) && (
          <div className="mt-auto pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2 mb-3">
              <MousePointerClick className="w-4 h-4 text-slate-400" />
              <h4 className="text-sm font-semibold text-slate-700">Botones</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {template.boton1 && (
                <div className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded-lg shadow-sm w-full sm:w-auto text-center break-words">
                  {template.boton1}
                </div>
              )}
              {template.boton2 && (
                <div className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 text-xs font-medium rounded-lg shadow-sm w-full sm:w-auto text-center hover:bg-slate-50 transition-colors break-words">
                  {template.boton2}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
