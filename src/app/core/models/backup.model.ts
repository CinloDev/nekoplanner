import { Idea } from './idea.model';
import { Post } from './post.model';
import { Settings } from './settings.model';

export interface NekoPlannerBackup {
  version: 1;
  exportedAt: string;
  posts: Post[];
  ideas: Idea[];
  settings: Settings;
}
