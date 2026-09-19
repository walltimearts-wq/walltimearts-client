import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { contentService } from '../services/contentService';

export interface SiteSettings {
    siteName: string;
    logoUrl: string;
    seoKeywords?: string;
    metaTitle?: string;
    metaDescription?: string;
}

/** One editable hero slide coming from the CMS (Admin → Content Management → Hero Slides) */
export interface CmsHeroSlide {
    id: number;
    tag: string;
    title: string;
    description: string;
    image: string;
    cta: { label: string; to: string };
}

interface SiteSettingsContextType {
    siteSettings: SiteSettings;
    heroSlides: CmsHeroSlide[];
    refresh: () => Promise<void>;
}

const FALLBACK: SiteSettings = {
    siteName: 'WallTimeArts',
    logoUrl: '',
    seoKeywords: '',
    metaTitle: 'WallTimeArts | Distinctive Timepieces & Wall Art',
    metaDescription: 'Shop handcrafted wall clocks and distinctive timepieces at WallTimeArts. Eco-friendly, artisan-made designs with free shipping on orders over Rs 50.',
};

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined);

const CACHE_KEY = 'siteSettings';

/** Upsert a <meta> tag in <head> (creates it if missing) */
const setMetaTag = (attr: 'name' | 'property', key: string, content: string) => {
    if (!content) return;
    let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
    if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
    }
    el.setAttribute('content', content);
};

/**
 * Convert CMS heroSlides (Admin managed) into the shape ScrollHeroSlider needs.
 * CMS slide fields: title, highlight, subtitle, description, buttonText, link, image.
 */
const mapCmsSlides = (slides: any[]): CmsHeroSlide[] =>
    (slides || [])
        .filter((s) => s && (s.image || s.title))
        .map((s, i) => ({
            id: i,
            tag: s.subtitle || '',
            // CMS stores a plain title + highlight part; render highlight italic like the static slides did
            title: s.highlight
                ? `${s.title || ''} <br /><span className="italic text-white/90 font-light">${s.highlight}</span>`
                : s.title || '',
            description: s.description || '',
            image: s.image || '',
            cta: {
                label: s.buttonText || 'Shop Now',
                to: s.link || '/products',
            },
        }));

export const SiteSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
        // Show cached values instantly on reload; network fetch refreshes below
        try {
            const cached = localStorage.getItem(CACHE_KEY);
            return cached ? { ...FALLBACK, ...JSON.parse(cached) } : FALLBACK;
        } catch {
            return FALLBACK;
        }
    });
    const [heroSlides, setHeroSlides] = useState<CmsHeroSlide[]>([]);

    const fetchSettings = useCallback(async () => {
        try {
            const content = await contentService.getContent('home_page');

            const next: SiteSettings = {
                siteName: content?.siteSettings?.siteName || FALLBACK.siteName,
                logoUrl: content?.siteSettings?.logoUrl || '',
                seoKeywords: content?.siteSettings?.seoKeywords || '',
                metaTitle: content?.siteSettings?.metaTitle || `${FALLBACK.siteName} | Distinctive Timepieces & Wall Art`,
                metaDescription: content?.siteSettings?.metaDescription || FALLBACK.metaDescription,
            };
            setSiteSettings(next);
            localStorage.setItem(CACHE_KEY, JSON.stringify(next));

            // --- Hero slides from CMS (dynamic slider) ---
            setHeroSlides(mapCmsSlides(content?.heroSlides || []));

            // --- Meta title ---
            if (next.metaTitle) {
                document.title = next.metaTitle;
            }

            // --- Meta tags (with brand name) ---
            const desc = next.metaDescription || '';
            setMetaTag('name', 'description', desc);
            setMetaTag('name', 'keywords', next.seoKeywords || '');
            // Open Graph (social sharing)
            setMetaTag('property', 'og:site_name', next.siteName);
            setMetaTag('property', 'og:title', next.metaTitle);
            setMetaTag('property', 'og:description', desc);
            setMetaTag('name', 'twitter:title', next.metaTitle);
            setMetaTag('name', 'twitter:description', desc);
            if (next.logoUrl) {
                setMetaTag('property', 'og:image', next.logoUrl);
            }
        } catch (err) {
            // Network failure — keep cached/fallback values silently
            console.error('Failed to load site settings', err);
        }
    }, []);

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    return (
        <SiteSettingsContext.Provider value={{ siteSettings, heroSlides, refresh: fetchSettings }}>
            {children}
        </SiteSettingsContext.Provider>
    );
};

export const useSiteSettings = (): SiteSettingsContextType => {
    const ctx = useContext(SiteSettingsContext);
    if (!ctx) throw new Error('useSiteSettings must be used within SiteSettingsProvider');
    return ctx;
};
