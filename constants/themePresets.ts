import { ThemePreset, StoreTheme } from '../types';

/**
 * Client-side mirror of the backend theme presets (src/constants/themePresets.js).
 *
 * Used as:
 *  1. Instant fallback for the admin preset gallery if the presets API is unavailable.
 *  2. The guaranteed default look (DEFAULT_THEME) applied store-wide even when
 *     the theme API cannot be reached (e.g. backend not yet redeployed).
 */

export const themePresets: Record<string, ThemePreset> = {
    default: {
        name: 'Classic (Current Brand)',
        colors: {
            primary: '#2B2118',
            primaryDark: '#1A130D',
            secondary: '#A9947A',
            accent: '#B7873F',
            background: '#F7F1E8',
            surface: '#FFFFFF',
            border: '#E8DDCF',
            text: '#2B2118',
            textMuted: '#7A6A58',
            success: '#2E7D32',
            danger: '#C0392B',
            sage: '#9C6B30',
            earth: '#5B3C27'
        },
        typography: {
            fontFamily: "'Manrope', Arial, Helvetica, sans-serif",
            headingFont: "'Playfair Display', Georgia, serif",
            baseFontSize: '16px',
            borderRadius: '8px'
        }
    },
    midnight: {
        name: 'Midnight Dark',
        colors: {
            primary: '#7C6CF0',
            primaryDark: '#5A4BC4',
            secondary: '#9AA4B2',
            accent: '#22D3EE',
            background: '#0F1420',
            surface: '#1A2130',
            border: '#2A3346',
            text: '#E8EAF0',
            textMuted: '#9AA4B2',
            success: '#34D399',
            danger: '#F87171',
            sage: '#818CF8',
            earth: '#312E81'
        },
        typography: {
            fontFamily: "'Manrope', Arial, Helvetica, sans-serif",
            headingFont: "'Poppins', 'Segoe UI', sans-serif",
            baseFontSize: '16px',
            borderRadius: '12px'
        }
    },
    forest: {
        name: 'Forest Green',
        colors: {
            primary: '#1B4332',
            primaryDark: '#081C15',
            secondary: '#95D5B2',
            accent: '#D8A24A',
            background: '#F4F9F4',
            surface: '#FFFFFF',
            border: '#D3E4D5',
            text: '#1B2A20',
            textMuted: '#5C6F61',
            success: '#2D6A4F',
            danger: '#BC4749',
            sage: '#40916C',
            earth: '#386641'
        },
        typography: {
            fontFamily: "'Nunito', 'Segoe UI', sans-serif",
            headingFont: "'Playfair Display', Georgia, serif",
            baseFontSize: '16px',
            borderRadius: '10px'
        }
    },
    sunset: {
        name: 'Sunset Warm',
        colors: {
            primary: '#E2574C',
            primaryDark: '#B03A31',
            secondary: '#F4A261',
            accent: '#E9C46A',
            background: '#FFF8F2',
            surface: '#FFFFFF',
            border: '#F0DFD2',
            text: '#33272A',
            textMuted: '#7D6B6F',
            success: '#43AA8B',
            danger: '#BC4749',
            sage: '#E76F51',
            earth: '#9C4A2F'
        },
        typography: {
            fontFamily: "'Lato', 'Segoe UI', sans-serif",
            headingFont: "'Montserrat', 'Segoe UI', sans-serif",
            baseFontSize: '16px',
            borderRadius: '14px'
        }
    },
    royal: {
        name: 'Royal Luxe',
        colors: {
            primary: '#4338CA',
            primaryDark: '#312E81',
            secondary: '#C9A227',
            accent: '#E11D48',
            background: '#FAF9FF',
            surface: '#FFFFFF',
            border: '#E2E0F5',
            text: '#211D33',
            textMuted: '#6D6887',
            success: '#15803D',
            danger: '#BE123C',
            sage: '#7C3AED',
            earth: '#4C1D95'
        },
        typography: {
            fontFamily: "'Jost', 'Segoe UI', sans-serif",
            headingFont: "'Playfair Display', Georgia, serif",
            baseFontSize: '16px',
            borderRadius: '6px'
        }
    },
    mono: {
        name: 'Minimal Mono',
        colors: {
            primary: '#111111',
            primaryDark: '#000000',
            secondary: '#A3A3A3',
            accent: '#F97316',
            background: '#FFFFFF',
            surface: '#F7F7F7',
            border: '#E5E5E5',
            text: '#171717',
            textMuted: '#737373',
            success: '#22C55E',
            danger: '#EF4444',
            sage: '#525252',
            earth: '#262626'
        },
        typography: {
            fontFamily: "'Roboto', Arial, sans-serif",
            headingFont: "'Roboto', Arial, sans-serif",
            baseFontSize: '15px',
            borderRadius: '0px'
        }
    }
};

/** The store's built-in default theme — always available, even offline. */
export const DEFAULT_THEME: StoreTheme = {
    preset: 'default',
    isCustom: false,
    colors: { ...themePresets.default.colors },
    typography: { ...themePresets.default.typography }
};
