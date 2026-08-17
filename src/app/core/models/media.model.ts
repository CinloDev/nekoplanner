export type MediaType = 'image' | 'video';

export interface Media {
  id: string;
  type: MediaType;
  url: string; // URL o referencia local
  name: string;
  size?: number; // en bytes
  mimeType?: string;
  width?: number;
  height?: number;
}
