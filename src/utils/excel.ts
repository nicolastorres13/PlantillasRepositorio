import * as XLSX from 'xlsx';
import { Template } from '../types';

export const parseExcel = async (file: File): Promise<Template[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
        
        if (jsonData.length < 2) {
          resolve([]);
          return;
        }

        const templates: Template[] = [];
        
        // Find column indices
        const headers = jsonData[0].map((h: string) => h ? String(h).toLowerCase().trim() : '');
        
        const getIndex = (possibleNames: string[], defaultIdx: number) => {
          const idx = headers.findIndex(h => possibleNames.some(name => h.includes(name)));
          return idx !== -1 ? idx : defaultIdx;
        };

        const idxPlantilla = getIndex(['plantilla', 'nombre'], 0);
        const idxFormato = getIndex(['formato'], 1);
        const idxTexto = getIndex(['texto'], 2);
        const idxBoton1 = getIndex(['botón 1', 'boton 1', 'boton1'], 3);
        const idxBoton2 = getIndex(['botón 2', 'boton 2', 'boton2'], 4);
        const idxArea = getIndex(['área', 'area'], 5);
        const idxTematica = getIndex(['temática', 'tematica', 'categoría', 'categoria'], 6);
        const idxTopTema = getIndex(['top tema', 'top'], 7);

        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i];
          if (!row || row.length === 0) continue;
          
          const plantilla = row[idxPlantilla] || '';
          const texto = row[idxTexto] || '';
          
          if (!plantilla && !texto) continue;

          templates.push({
            id: `template-${i}`,
            plantilla: String(plantilla),
            formato: String(row[idxFormato] || ''),
            texto: String(texto),
            boton1: String(row[idxBoton1] || ''),
            boton2: String(row[idxBoton2] || ''),
            area: String(row[idxArea] || ''),
            tematica: String(row[idxTematica] || ''),
            topTema: String(row[idxTopTema] || ''),
          });
        }
        
        resolve(templates);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};
