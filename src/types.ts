export interface Template {
  id: string;
  plantilla: string;
  formato: string;
  texto: string;
  boton1: string;
  boton2: string;
  area: string;
  tematica: string;
  topTema: string;
}

export interface Filters {
  plantillas: string[];
  formatos: string[];
  texto: string;
  hasBoton1: boolean | null;
  hasBoton2: boolean | null;
  areas: string[];
  tematicas: string[];
  topTemas: string[];
}
