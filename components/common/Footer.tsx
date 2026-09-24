
import React, { useState, useEffect } from 'react';
import { Facebook, Instagram, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { contentService } from '../../services/contentService';
import { productService } from '../../services/productService';
import { useLanguage } from '../../context/LanguageContext';
import { useSiteSettings } from '../../context/SiteSettingsContext';


const Footer: React.FC = () => {
  const { t } = useLanguage();
  const { siteSettings } = useSiteSettings();
  const [cmsContent, setCmsContent] = useState<any>(null);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [content, cats] = await Promise.all([
          contentService.getContent('home_page'),
          productService.getCategories()
        ]);
        setCmsContent(content);
        setCategories(cats.map((c: any) => c.name).slice(0, 4));
      } catch (err) {
        console.error('Failed to load footer data');
      }
    };
    fetchData();
  }, []);

  const footer = cmsContent?.footer;

  return (
    <footer className="bg-primary text-sand pt-16 pb-8 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="text-2xl font-serif font-bold tracking-tight">
              {siteSettings?.siteName || 'WallTimeArts'}
            </Link>
            <p className="text-sand/70 text-sm font-sans leading-relaxed max-w-xs">
              {footer?.description || t('footer.description')}
            </p>
            <div className="flex space-x-5">
              {/* Facebook */}
              <a href={footer?.socialLinks?.facebook || 'https://www.facebook.com/profile.php?id=61588316309529'} target="_blank" rel="noopener noreferrer" className="text-sand/60 hover:text-white transition-colors" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              {/* Instagram */}
              <a href={footer?.socialLinks?.instagram || 'https://www.instagram.com/walltimearts/'} target="_blank" rel="noopener noreferrer" className="text-sand/60 hover:text-white transition-colors" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              {/* TikTok */}
              <a href={footer?.socialLinks?.tiktok || 'https://www.tiktok.com/@walltimearts'} target="_blank" rel="noopener noreferrer" className="text-sand/60 hover:text-white transition-colors" aria-label="TikTok">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
                </svg>
              </a>
              {/* YouTube */}
              <a href={footer?.socialLinks?.youtube || 'https://www.youtube.com/@walltimearts'} target="_blank" rel="noopener noreferrer" className="text-sand/60 hover:text-white transition-colors" aria-label="YouTube">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-sm font-serif font-bold uppercase tracking-wider mb-6 text-sage">{t('footer.collections')}</h4>
            <ul className="space-y-4">
              <li><Link to="/products" className="text-sand/70 hover:text-white text-sm font-sans transition-colors">{t('nav.shopAll')}</Link></li>
              {categories.map(cat => (
                <li key={cat}>
                  <Link to={`/products?category=${cat}`} className="text-sand/70 hover:text-white text-sm font-sans transition-colors">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-serif font-bold uppercase tracking-wider mb-6 text-sage">{t('footer.support')}</h4>
            <ul className="space-y-4">
              <li><Link to="/shipping-returns" className="text-sand/70 hover:text-white text-sm font-sans transition-colors">{t('footer.shippingReturns')}</Link></li>
              <li><Link to="/track-order" className="text-sand/70 hover:text-white text-sm font-sans transition-colors">{t('footer.trackOrder')}</Link></li>
              <li><Link to="/faq" className="text-sand/70 hover:text-white text-sm font-sans transition-colors">{t('footer.faq')}</Link></li>
              <li><Link to="/contact" className="text-sand/70 hover:text-white text-sm font-sans transition-colors">{t('footer.contactUs')}</Link></li>
              <li><Link to="/about" className="text-sand/70 hover:text-white text-sm font-sans transition-colors">{t('footer.aboutUs')}</Link></li>
              <li><Link to="/policies" className="text-sand/70 hover:text-white text-sm font-sans transition-colors">{t('footer.policies')}</Link></li>
            </ul>

            {/* Customer service number */}
            <div className="mt-6 pt-6 border-t border-white/5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-sand/40 font-sans mb-2">
                {t('footer.serviceNumber')}
              </p>
              <a
                href="tel:+923079261677"
                className="inline-flex items-center gap-2 text-sand/80 hover:text-white text-sm font-sans transition-colors"
              >
                <Phone className="w-4 h-4 text-sage" />
                +92 0307 9261677
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-sand/40 font-sans">           <p>{`© ${new Date().getFullYear()} ${siteSettings?.siteName || 'WallTimeArts'}. ${t('footer.allRightsReserved')}`}</p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 mt-4 md:mt-0">
            <Link to="/policies#shipping" className="hover:text-white transition-colors">{t('policies.navShipping')}</Link>
            <Link to="/policies#returns" className="hover:text-white transition-colors">{t('policies.navReturns')}</Link>
            <Link to="/policies#refunds" className="hover:text-white transition-colors">{t('policies.navRefunds')}</Link>
            <Link to="/privacy-policy" className="hover:text-white transition-colors">{t('footer.privacyPolicy')}</Link>
            <Link to="/terms-of-service" className="hover:text-white transition-colors">{t('footer.termsOfService')}</Link>
            <Link to="/policies" className="hover:text-white transition-colors">{t('footer.policies')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
