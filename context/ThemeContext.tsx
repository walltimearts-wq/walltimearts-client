import React, { createContext, useContext, useEffect, useCallback, useState } from 'react';
import { contentService } from '../services/contentService';
import { StoreTheme } from '../types';
import { DEFAULT_THEME } from '../constants/themePresets';

/**
 * Store theme context.
 *
 * Fetches the theme the admin applied (backend: Content.theme) and applies it
 * store-wide by overriding the CSS variables declared in index.html.
 * Tailwind tokens (primary, secondary, accent, sand, stone, sage, earth) and
 * fonts are wired to these variables, so every page picks the theme up.
 */

const CACHE_KEY = 'storeTheme';

/** Tailwind token (CSS var) -> theme.colors key */
const COLOR_VAR_MAP: Record<string, keyof StoreTheme['colors']> = {
    '--c-primary': 'primary',
    '--c-secondary': 'secondary',
    '--c-accent': 'accent',
    '--c-sand': 'background', // Tailwind "sand" token = page background
    '--c-stone': 'border',    // Tailwind "stone" token = borders
    '--c-sage': 'sage',
    '--c-earth': 'earth',
};

/** Hex mirrors for plain CSS / inline styles */
const HEX_VAR_MAP: Record<string, keyof StoreTheme['colors']> = {
    '--color-primary': 'primary',
    '--color-secondary': 'secondary',
    '--color-accent': 'accent',
    '--color-background': 'background',
    '--color-surface': 'surface',
    '--color-border': 'border',
    '--color-text': 'text',
    '--color-text-muted': 'textMuted',
    '--color-success': 'success',
    '--color-danger': 'danger',
    '--color-sage': 'sage',
    '--color-earth': 'earth',
};

/** #RGB | #RRGGBB | #RRGGBBAA -> "R G B" triplet (for Tailwind alpha modifiers) */
export const hexToRgbTriplet = (hex: string): string => {
    let h = hex.replace('#', '').trim();
    if (h.length === 3) h = h.split('').map((c) => c + c).join('');
    if (h.length === 8) h = h.slice(0, 6);
    const n = parseInt(h, 16);
    if (Number.isNaN(n) || h.length !== 6) return '0 0 0';
    return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
};

/** Generic-keyword families that should not be requested from Google Fonts */
const FONT_SKIP = new Set([
    'serif', 'sans-serif', 'monospace', 'cursive', 'fantasy', 'system-ui',
    'arial', 'helvetica', 'georgia', 'times', 'ui-sans-serif', 'ui-serif',
]);

/** Load a Google Font stylesheet so custom admin fonts actually render */
const loadGoogleFonts = (stacks: (string | undefined)[]) => {
    const families = stacks
        .flatMap((s) => (s || '').split(','))
        .map((f) => f.trim().replace(/^['"]|['"]$/g, ''))
        .filter((f) => f && !FONT_SKIP.has(f.toLowerCase()));
    if (!families.length) return;

    const query = families.map((f) => `family=${f.replace(/ /g, '+')}:wght@300;400;500;600;700;800`).join('&');
    const href = `https://fonts.googleapis.com/css2?${query}&display=swap`;
    if (document.querySelector(`link[href="${href}"]`)) return;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
};

/** Apply a theme to the document (all CSS variables at once) */
export const applyTheme = (theme: StoreTheme | null | undefined) => {
    if (!theme) return;
    const root = document.documentElement.style;
    const colors = theme.colors || ({} as StoreTheme['colors']);

    Object.entries(COLOR_VAR_MAP).forEach(([cssVar, key]) => {
        if (colors[key]) root.setProperty(cssVar, hexToRgbTriplet(colors[key]));
    });
    Object.entries(HEX_VAR_MAP).forEach(([cssVar, key]) => {
        if (colors[key]) root.setProperty(cssVar, colors[key]);
    });
    if (colors.background) root.setProperty('--bg', colors.background);
    if (colors.text) root.setProperty('--text', colors.text);

    const t = theme.typography || ({} as StoreTheme['typography']);
    if (t.fontFamily) root.setProperty('--font-body', t.fontFamily);
    if (t.headingFont) root.setProperty('--font-heading', t.headingFont);
    if (t.baseFontSize) root.setProperty('--font-size-base', t.baseFontSize);
    if (t.borderRadius) root.setProperty('--radius-base', t.borderRadius);

    loadGoogleFonts([t.fontFamily, t.headingFont]);
};

/** Read the cached theme (instant apply, no flash of default colors) */
const readCachedTheme = (): StoreTheme | null => {
    try {
        const cached = localStorage.getItem(CACHE_KEY);
        return cached ? (JSON.parse(cached) as StoreTheme) : null;
    } catch {
        return null;
    }
};

// Apply the cached theme synchronously at module load — before React mounts,
// so returning visitors never see a flash of the default palette.
const cachedTheme = readCachedTheme();
if (cachedTheme) applyTheme(cachedTheme);

interface ThemeContextType {
    theme: StoreTheme | null;
    updateTheme: (body: {
        preset?: string;
        isCustom?: boolean;
        colors?: Partial<StoreTheme['colors']>;
        typography?: Partial<StoreTheme['typography']>;
    }) => Promise<StoreTheme>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<StoreTheme | null>(cachedTheme);

    useEffect(() => {
        let cancelled = false;
        contentService
            .getTheme()
            .then((fresh) => {
                if (cancelled) return;
                setTheme(fresh);
                applyTheme(fresh);
                try { localStorage.setItem(CACHE_KEY, JSON.stringify(fresh)); } catch { /* ignore */ }
            })
            .catch((err) => {
                // Server theme unavailable (e.g. backend not yet redeployed).
                // Keep any cached theme; otherwise guarantee the built-in default look.
                console.error('Failed to load store theme, using built-in default', err);
                if (cancelled) return;
                if (!cachedTheme) {
                    setTheme(DEFAULT_THEME);
                    applyTheme(DEFAULT_THEME);
                }
            });
        return () => { cancelled = true; };
    }, []);

    const updateTheme = useCallback(async (body: Parameters<ThemeContextType['updateTheme']>[0]) => {
        const fresh = await contentService.updateTheme(body);
        setTheme(fresh);
        applyTheme(fresh); // live preview across the whole admin page instantly
        try { localStorage.setItem(CACHE_KEY, JSON.stringify(fresh)); } catch { /* ignore */ }
        return fresh;
    }, []);

    return <ThemeContext.Provider value={{ theme, updateTheme }}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextType => {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
    return ctx;
};
