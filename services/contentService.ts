import api from './api';
import { ApiResponse, StoreTheme, ThemePreset } from '../types';

export const contentService = {
    getContent: async (identifier: string = 'home_page') => {
        const response = await api.get<ApiResponse<{ content: any }>>(`/content/${identifier}`);
        return response.data.data.content;
    },

    updateContent: async (identifier: string, data: FormData) => {
        const response = await api.put<ApiResponse<{ content: any }>>(`/content/${identifier}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.data.content;
    },

    // ---------- Store theme (Admin → Settings → Store Theme) ----------

    getTheme: async (): Promise<StoreTheme> => {
        const response = await api.get<ApiResponse<{ theme: StoreTheme }>>(`/content/theme`);
        return response.data.data.theme;
    },

    getThemePresets: async (): Promise<Record<string, ThemePreset>> => {
        const response = await api.get<ApiResponse<{ presets: Record<string, ThemePreset> }>>(`/content/theme/presets`);
        return response.data.data.presets;
    },

    updateTheme: async (data: {
        preset?: string;
        isCustom?: boolean;
        colors?: Partial<StoreTheme['colors']>;
        typography?: Partial<StoreTheme['typography']>;
    }): Promise<StoreTheme> => {
        const response = await api.put<ApiResponse<{ theme: StoreTheme }>>(`/content/theme`, data);
        return response.data.data.theme;
    }
};
