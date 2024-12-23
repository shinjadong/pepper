import { Block } from '@/types';

export interface PluginManifest {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  icon?: string;
  permissions?: PluginPermission[];
}

export type PluginPermission =
  | 'read_blocks'
  | 'write_blocks'
  | 'read_files'
  | 'write_files'
  | 'network'
  | 'notifications';

export interface PluginContext {
  // 블록 관련
  getBlock: (id: string) => Promise<Block | null>;
  createBlock: (block: Omit<Block, 'id'>) => Promise<Block>;
  updateBlock: (id: string, block: Partial<Block>) => Promise<Block>;
  deleteBlock: (id: string) => Promise<void>;

  // 파일 관련
  uploadFile: (file: File) => Promise<string>;
  downloadFile: (url: string) => Promise<Blob>;

  // UI 관련
  showNotification: (message: string, type?: 'info' | 'success' | 'error') => void;
  showDialog: (content: React.ReactNode) => Promise<void>;
  
  // 네트워크 관련
  fetch: typeof fetch;
}

export interface PluginModule {
  manifest: PluginManifest;
  activate: (context: PluginContext) => Promise<void>;
  deactivate: () => Promise<void>;
}

export interface BlockPlugin extends PluginModule {
  renderBlock?: (block: Block) => React.ReactNode;
  handleBlockAction?: (block: Block, action: string) => Promise<void>;
}

export interface CommandPlugin extends PluginModule {
  commands: {
    id: string;
    name: string;
    description: string;
    handler: () => Promise<void>;
    keybinding?: string;
  }[];
}

export interface ViewPlugin extends PluginModule {
  views: {
    id: string;
    name: string;
    icon: React.ReactNode;
    component: React.ComponentType<{ blocks: Block[] }>;
  }[];
}

export type Plugin = BlockPlugin | CommandPlugin | ViewPlugin;

export interface PluginStore {
  id: string;
  manifest: PluginManifest;
  enabled: boolean;
  installDate: string;
  updateDate?: string;
  settings?: Record<string, any>;
}
