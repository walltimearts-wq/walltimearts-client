import { useEffect } from 'react';
import { useSiteSettings } from '../context/SiteSettingsContext';

interface PageMetaOptions {
    /** Page-specific part of the title, e.g. "Shop" or the product name */
    title?: string;
    /** Optional page-specific meta description (falls back to the site-wide one) */
    description?: string;
}

/**
 * Sets per-page meta tags, always suffixed/prefixed with the dynamic brand name.
 *
 *  - title "Shop"          → "Shop | WallTimeArts"   (tab + og:title + twitter:title)
 *  - no title              → site meta title from CMS (e.g. "WallTimeArts | Distinctive…")
 *  - description omitted   → site meta description from CMS
 *
 * Restores the site-wide meta title when the component unmounts.
 */
export const usePageMeta = ({ title, description }: PageMetaOptions = {}) => {
    const { siteSettings } = useSiteSettings();
    const brand = siteSettings.siteName;
    const siteMetaTitle = siteSettings.metaTitle || `${brand} | Distinctive Timepieces & Wall Art`;
    const siteMetaDesc =
        siteSettings.metaDescription ||
        `Shop handcrafted wall clocks and distinctive timepieces at ${brand}.`;

    const fullTitle = title ? `${title} | ${brand}` : siteMetaTitle;
    const fullDescription = description || siteMetaDesc;

    useEffect(() => {
        document.title = fullTitle;

        const upsert = (selector: string, attr: 'name' | 'property', key: string, content: string) => {
            if (!content) return;
            let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
            if (!el) {
                el = document.createElement('meta');
                el.setAttribute(attr, key);
                document.head.appendChild(el);
            }
            el.setAttribute('content', content);
        };

        upsert('', 'name', 'description', fullDescription);
        upsert('', 'property', 'og:title', fullTitle);
        upsert('', 'property', 'og:description', fullDescription);
        upsert('', 'name', 'twitter:title', fullTitle);
        upsert('', 'name', 'twitter:description', fullDescription);

        // Restore site-wide meta when leaving the page
        return () => {
            document.title = siteMetaTitle;
            upsert('', 'name', 'description', siteMetaDesc);
            upsert('', 'property', 'og:title', siteMetaTitle);
            upsert('', 'property', 'og:description', siteMetaDesc);
            upsert('', 'name', 'twitter:title', siteMetaTitle);
            upsert('', 'name', 'twitter:description', siteMetaDesc);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fullTitle, fullDescription, siteMetaTitle, siteMetaDesc]);
};
