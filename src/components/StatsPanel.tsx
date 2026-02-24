import React, { useMemo } from 'react';
import { Template } from '../types';
import { BarChart3, PieChart } from 'lucide-react';

interface StatsPanelProps {
  templates: Template[];
}

export const StatsPanel: React.FC<StatsPanelProps> = ({ templates }) => {
  const stats = useMemo(() => {
    const byArea: Record<string, number> = {};
    const byTematica: Record<string, number> = {};
    
    templates.forEach(t => {
      if (t.area) {
        byArea[t.area] = (byArea[t.area] || 0) + 1;
      }
      if (t.tematica) {
        byTematica[t.tematica] = (byTematica[t.tematica] || 0) + 1;
      }
    });

    return {
      total: templates.length,
      areas: Object.entries(byArea).sort((a, b) => b[1] - a[1]).slice(0, 5),
      tematicas: Object.entries(byTematica).sort((a, b) => b[1] - a[1]).slice(0, 5)
    };
  }, [templates]);

  if (templates.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Total Plantillas</h3>
        <p className="text-4xl font-bold text-slate-900">{stats.total}</p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-4 h-4 text-indigo-500" />
          <h3 className="text-sm font-semibold text-slate-900">Top Áreas</h3>
        </div>
        <div className="space-y-3">
          {stats.areas.map(([area, count]) => (
            <div key={area} className="flex items-center justify-between text-sm">
              <span className="text-slate-600 truncate pr-4">{area}</span>
              <div className="flex items-center gap-3 w-1/2">
                <div className="h-2 bg-indigo-100 rounded-full flex-1 overflow-hidden">
                  <div 
                    className="h-full bg-indigo-500 rounded-full" 
                    style={{ width: `${(count / stats.total) * 100}%` }}
                  />
                </div>
                <span className="font-medium text-slate-900 w-8 text-right">{count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <PieChart className="w-4 h-4 text-emerald-500" />
          <h3 className="text-sm font-semibold text-slate-900">Top Temáticas</h3>
        </div>
        <div className="space-y-3">
          {stats.tematicas.map(([tematica, count]) => (
            <div key={tematica} className="flex items-center justify-between text-sm">
              <span className="text-slate-600 truncate pr-4">{tematica}</span>
              <div className="flex items-center gap-3 w-1/2">
                <div className="h-2 bg-emerald-100 rounded-full flex-1 overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full" 
                    style={{ width: `${(count / stats.total) * 100}%` }}
                  />
                </div>
                <span className="font-medium text-slate-900 w-8 text-right">{count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
