import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import {
  Plugin,
  PluginManifest,
  PluginContext,
  PluginStore,
} from '@/types/plugin';
import { toast } from 'sonner';

class PluginManager {
  private plugins: Map<string, Plugin> = new Map();
  private context: PluginContext;
  private supabase = createClientComponentClient();

  constructor() {
    // 플러그인 컨텍스트 초기화
    this.context = {
      // 블록 관련
      getBlock: async (id) => {
        const { data } = await this.supabase
          .from('blocks')
          .select('*')
          .eq('id', id)
          .single();
        return data;
      },
      createBlock: async (block) => {
        const { data, error } = await this.supabase
          .from('blocks')
          .insert(block)
          .select()
          .single();
        if (error) throw error;
        return data;
      },
      updateBlock: async (id, block) => {
        const { data, error } = await this.supabase
          .from('blocks')
          .update(block)
          .eq('id', id)
          .select()
          .single();
        if (error) throw error;
        return data;
      },
      deleteBlock: async (id) => {
        const { error } = await this.supabase
          .from('blocks')
          .delete()
          .eq('id', id);
        if (error) throw error;
      },

      // 파일 관련
      uploadFile: async (file) => {
        const fileName = `${Date.now()}-${file.name}`;
        const { error: uploadError } = await this.supabase.storage
          .from('plugins')
          .upload(fileName, file);
        if (uploadError) throw uploadError;

        const { data } = this.supabase.storage
          .from('plugins')
          .getPublicUrl(fileName);
        return data.publicUrl;
      },
      downloadFile: async (url) => {
        const response = await fetch(url);
        return response.blob();
      },

      // UI 관련
      showNotification: (message, type = 'info') => {
        toast[type](message);
      },
      showDialog: async (content) => {
        // TODO: 다이얼로그 구현
      },

      // 네트워크 관련
      fetch: fetch.bind(window),
    };
  }

  async loadPlugin(manifest: PluginManifest): Promise<void> {
    try {
      // 플러그인이 이미 로드되어 있는지 확인
      if (this.plugins.has(manifest.id)) {
        throw new Error('Plugin already loaded');
      }

      // 플러그인 코드 로드
      const module = await import(`/plugins/${manifest.id}/index.js`);
      const plugin = module.default as Plugin;

      // 매니페스트 검증
      this.validateManifest(manifest);

      // 플러그인 활성화
      await plugin.activate(this.context);

      // 플러그인 저장
      this.plugins.set(manifest.id, plugin);

      // 플러그인 상태 저장
      await this.savePluginState(manifest);

      toast.success(`플러그인 ${manifest.name}이(가) 로드되었습니다.`);
    } catch (error) {
      console.error('Failed to load plugin:', error);
      toast.error(`플러그인 로드 실패: ${error.message}`);
    }
  }

  async unloadPlugin(id: string): Promise<void> {
    const plugin = this.plugins.get(id);
    if (!plugin) return;

    try {
      await plugin.deactivate();
      this.plugins.delete(id);

      // 플러그인 상태 업데이트
      await this.updatePluginState(id, { enabled: false });

      toast.success(`플러그인이 언로드되었습니다.`);
    } catch (error) {
      console.error('Failed to unload plugin:', error);
      toast.error(`플러그인 언로드 실패: ${error.message}`);
    }
  }

  getPlugin(id: string): Plugin | undefined {
    return this.plugins.get(id);
  }

  getAllPlugins(): Plugin[] {
    return Array.from(this.plugins.values());
  }

  private validateManifest(manifest: PluginManifest) {
    const required = ['id', 'name', 'version', 'author'];
    for (const field of required) {
      if (!manifest[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }
  }

  private async savePluginState(manifest: PluginManifest) {
    const { error } = await this.supabase.from('plugins').insert({
      id: manifest.id,
      manifest,
      enabled: true,
      installDate: new Date().toISOString(),
    });

    if (error) throw error;
  }

  private async updatePluginState(id: string, update: Partial<PluginStore>) {
    const { error } = await this.supabase
      .from('plugins')
      .update(update)
      .eq('id', id);

    if (error) throw error;
  }
}

// 싱글톤 인스턴스
export const pluginManager = new PluginManager();
