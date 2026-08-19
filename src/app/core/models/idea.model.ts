import { Tag } from './tag.model';

export interface Idea {
  id: string;
  title: string;
  content: string; // Descripción o texto preliminar
  tags?: Tag[];
  createdAt: string; // ISO date string para simplificar serialización
  updatedAt: string; // ISO date string
  convertedToPostId?: string;
}
