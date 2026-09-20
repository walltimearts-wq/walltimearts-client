import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Sparkles, ThumbsUp, Award, Star } from 'lucide-react';
import ProductCard from '../components/common/ProductCard';
import { Product, ProductCategory } from '../types';
import { motion } from 'framer-motion';
import Loader from '../components/common/Loader';
import { useLanguage } from '../context/LanguageContext';
import { ScrollHeroSlider, SLIDES } from '../components/sections/Hero3D';
import Testimonials from '../components/sections/Testimonials';
import { productService } from '../services/productService';
import { usePageMeta } from '../hooks/usePageMeta';
import { useSiteSettings } from '../context/SiteSettingsContext';

// ──────────────────────────────────────────────────────────────────────
//  Mock fallback — used only when the API is unavailable / fails
// ──────────────────────────────────────────────────────────────────────

const MOCK_BEST_SELLERS: Product[] = [
  {
    _id: '1',
    slug: 'classic-wooden-wall-clock',
    name: 'Classic Wooden Wall Clock',
    price: 49.99,
    category: 'Wooden Wall Clock',
    description:
      'Handcrafted wooden wall clock with a rustic finish. Perfect for living rooms and farmhouse-style interiors.',
    images: [
      {
        public_id: 'wc-wooden-1',
        url: 'https://m.media-amazon.com/images/I/61Z7cwC1cbL._AC_UF894,1000_QL80_.jpg',
      },
    ],
    rating: 4.5,
    numOfReviews: 124,
    stock: 50,
    featured: true,
    discount: 10,
  },
  {
    _id: '2',
    slug: 'vintage-roman-numeral-clock',
    name: 'Vintage Roman Numeral Clock',
    price: 59.99,
    category: 'Vintage Wall Clock',
    description:
      'Elegant vintage-style wall clock featuring classic Roman numerals with a brass-toned bezel.',
    images: [
      {
        public_id: 'wc-vintage-1',
        url: 'https://images.unsplash.com/photo-1501084817091-a4f3d1d38f86?w=600&q=80',
      },
    ],
    rating: 4.7,
    numOfReviews: 156,
    stock: 30,
    featured: true,
    discount: 15,
  },
  {
    _id: '3',
    slug: 'aesthetic-floral-wall-clock',
    name: 'Aesthetic Floral Wall Clock',
    price: 74.99,
    category: 'Aesthetic Wall Clock',
    description:
      'Beautiful floral artwork wraps around a white face — a unique piece of wall art.',
    images: [
      {
        public_id: 'wc-floral-1',
        url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80',
      },
    ],
    rating: 4.9,
    numOfReviews: 98,
    stock: 20,
    featured: true,
    discount: 20,
  },
  {
    _id: '4',
    slug: '3d-geometric-wall-clock',
    name: '3D Geometric Wall Clock',
    price: 44.99,
    category: '3D Wall Clock',
    description:
      'Eye-catching 3D geometric design that creates depth and visual interest on any wall.',
    images: [
      {
        public_id: 'wc-3d-1',
        url: 'https://www.kreative.pk/cdn/shop/files/3d_Wall_Clock_img.jpg?v=1725810751&width=493',
      },
    ],
    rating: 4.6,
    numOfReviews: 77,
    stock: 40,
    featured: true,
    discount: 10,
  },
];

const MOCK_COLLECTIONS: ProductCategory[] = [
  {
    _id: 'c1',
    name: 'Simple Wall Clock',
    description: 'Clean, minimal designs for everyday use.',
    image:
      'https://images.unsplash.com/photo-1563861826100-9cb8680cb0b6?w=600&q=80',
  },
  {
    _id: 'c2',
    name: 'Aesthetic Wall Clock',
    description: 'Beauty meets function — clocks that double as wall art.',
    image:
      'https://images.unsplash.com/photo-1507646227221-78c7b1a5b496?w=600&q=80',
  },
  {
    _id: 'c3',
    name: '3D Wall Clock',
    description: 'Depth, dimension, and drama — standout 3D designs.',
    image:
      'https://www.kreative.pk/cdn/shop/files/3d_Wall_Clock_img.jpg?v=1725810751&width=493',
  },
  {
    _id: 'c4',
    name: 'Vintage Wall Clock',
    description: 'Retro-inspired classics with timeless charm.',
    image:
      'https://images.unsplash.com/photo-1501084817091-a4f3d1d38f86?w=600&q=80',
  },
  {
    _id: 'c5',
    name: 'Kids Wall Clock',
    description: 'Fun, colorful, easy-to-read clocks for young spaces.',
    image:
      'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=600&q=80',
  },
  {
    _id: 'c6',
    name: 'LED & Digital Clock',
    description: 'Modern illumination with precise digital timekeeping.',
    image:
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
  },
  {
    _id: 'c7',
    name: 'Luxury Wall Clock',
    description: 'Premium finishes, gold accents, and crystal details.',
    image:
      'https://www.giftforyou.pk/image/cache/catalog/journal3/categories/wall-clocks/diy-wall-clocks/cyprus-modernized-3d-wall-clock-149-550x550.jpg',
  },
  {
    _id: 'c8',
    name: 'Wooden Wall Clock',
    description: 'Warm, natural wood craftsmanship for cozy interiors.',
    image:
      'https://m.media-amazon.com/images/I/61Z7cwC1cbL._AC_UF894,1000_QL80_.jpg',
  },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const normalizeProduct = (product: any): Product => ({
  ...product,
  id: product._id || product.id,
  image: product.images?.[0]?.url || product.image || '',
  secondaryImage: product.images?.[1]?.url || product.secondaryImage || '',
  reviewsCount: product.numOfReviews || product.reviewsCount || 0,
  category:
    typeof product.category === 'string'
      ? product.category
      : product.category?.name || 'All',
});

/**
 * Build hero slides from wall clock products.
 * Each product becomes one full-viewport scroll-slide with its image.
 * Always returns exactly 3 slides — falls back to static SLIDES when empty.
 */
function buildSlidesFromProducts(
  products: Product[],
): typeof SLIDES {
  if (!products.length) return SLIDES;

  // Take up to 3 products; pad with mock slides if fewer than 3
  const chosen = products.slice(0, 3);
  return chosen.map((product, idx) => ({
    id: idx,
    tag: product.category + ' Wall Clock',
    title: product.name,
    description:
      product.description.length > 100
        ? product.description.slice(0, 100) + '…'
        : product.description,
    image:
      product.image ||
      product.images?.[0]?.url ||
      SLIDES[idx]?.image ||
      '',
    cta: {
      label: 'View Clock',
      to: `/products/${product._id || product.id}`,
    },
  }));
}

/* ------------------------------------------------------------------ */
/*  Component                                                           */
/* ------------------------------------------------------------------ */

const Home: React.FC = () => {
  const { t } = useLanguage();
  const { heroSlides: cmsSlides } = useSiteSettings();
  usePageMeta({});

  // Data sources — start with mock, replace once API responds
  const [bestSellers, setBestSellers] = useState<Product[]>(
    MOCK_BEST_SELLERS.map(normalizeProduct),
  );
  const [collections, setCollections] = useState<ProductCategory[]>(MOCK_COLLECTIONS);
  // Product-based hero slides from the API (null = not resolved yet → static SLIDES)
  const [productSlides, setProductSlides] = useState<typeof SLIDES | null>(null);

  // Derived hero slides. CMS slides (Admin → Content Management → Hero Slides)
  // always win as soon as they arrive, so every slide image is dynamic —
  // no race between the site-settings fetch and the data fetch below.
  //   1. CMS heroSlides  2. Product-based slides  3. Static SLIDES fallback
  const slides: typeof SLIDES = cmsSlides.length > 0
    ? (cmsSlides as typeof SLIDES)
    : productSlides ?? SLIDES;

  const [loading, setLoading] = useState(true);
  const [apiAvailable, setApiAvailable] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1 — Best-sellers  (featured products, newest first)
        let apiProducts: Product[] = [];
        try {
          const productsRes = await productService.getProducts({
            limit: 8,
            sort: '-createdAt',
          });
          apiProducts = (productsRes?.products || []).map(normalizeProduct);
        } catch {
          // API unavailable — keep mock
        }

        // 2 — Collections / categories
        let apiCollections: ProductCategory[] = [];
        try {
          const cats = await productService.getCategories();
          apiCollections = (cats || []).map((c: any) => ({
            _id: c._id,
            name: c.name,
            description: c.description || '',
            image:
              c.image ||
              `https://images.unsplash.com/photo-1586075088921-82b1e7268b9f?w=600&q=80`,
          }));
        } catch {
          // API unavailable — keep mock
        }

        // Decide whether the API gave us anything useful
        const apiWorking = apiProducts.length > 0 && apiCollections.length > 0;
        setApiAvailable(apiWorking);

        // Merge: API data wins when available, otherwise mock stays
        setBestSellers(
          apiWorking ? apiProducts.slice(0, 4) : MOCK_BEST_SELLERS.map(normalizeProduct),
        );
        setCollections(
          apiWorking
            ? apiCollections.slice(0, 4)
            : MOCK_COLLECTIONS,
        );

        // Product-based slides (priority 2, used only until/without CMS slides)
        const apiHasImages = apiProducts.some(
          (p) => p.image || (p.images && p.images[0]?.url),
        );
        setProductSlides(
          apiWorking && apiHasImages
            ? buildSlidesFromProducts(apiProducts)
            : null,
        );
      } catch (err) {
        console.error('Failed to load home data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Loader fullPage color="rgb(var(--c-primary))" />;

  return (
    <div className="bg-sand text-primary">
      {/* USP Bar */}
      <div className="bg-sage/10 py-3 border-b border-sage/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-center items-center gap-4 md:gap-12 text-xs md:text-sm font-sans tracking-wide text-primary/80">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>Handcrafted Timekeeping</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            <span>Distinctive Designs</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            <span>4.9★ Customer Rating</span>
          </div>
        </div>
      </div>

      {/* HERO — 3D scroll-driven slider (API-driven or mock fallback) */}
      <ScrollHeroSlider slides={slides} />

      {/* BESTSELLERS */}
      <motion.section
        className="bg-white py-20 px-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.16 }}
        transition={{ duration: 0.45 }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="flex justify-between items-end mb-12"
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
          >
            <div>
              <span className="text-sage text-xs uppercase tracking-widest font-bold block mb-2">{t('home.mostLoved')}</span>
              <h2 className="text-3xl md:text-4xl font-serif font-medium">Bestsellers</h2>
            </div>
            <Link to="/products" className="hidden md:flex items-center gap-2 text-primary/60 hover:text-primary transition-colors text-sm border-b border-transparent hover:border-primary pb-0.5">
              {t('home.viewAll')} <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {bestSellers.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.18 }}
                transition={{ duration: 0.5, delay: index * 0.09, ease: 'easeOut' }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center md:hidden">
            <Link to="/products" className="btn-primary inline-flex">{t('home.viewAll')}</Link>
          </div>
        </div>
      </motion.section>

      {/* OUR COLLECTIONS */}
      <motion.section
        className="py-20 px-6 max-w-7xl mx-auto"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.16 }}
        transition={{ duration: 0.45 }}
      >
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
        >
          <h2 className="text-3xl md:text-4xl font-serif font-medium mb-4">{t('home.ourCollections')}</h2>
          <p className="text-primary/60 max-w-lg mx-auto font-sans">
            {t('home.collectionsDesc')}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {collections.map((cat, idx) => (
            <motion.div
              key={cat._id || idx}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.18 }}
              transition={{ duration: 0.5, delay: idx * 0.1, ease: 'easeOut' }}
            >
              <Link to={`/products?category=${cat.name}`} className="group block text-center">
                <div className="aspect-[4/5] bg-stone/20 overflow-hidden mb-4 relative rounded-md shadow-sm group-hover:shadow-lg transition-all duration-300">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    onError={(e) => (e.currentTarget.src = 'https://images.unsplash.com/photo-1586075088921-82b1e7268b9f?w=600')}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300" />
                </div>
                <h3 className="text-lg font-serif font-medium group-hover:text-sage transition-colors">{cat.name}</h3>
                <p className="text-xs text-primary/40 mt-1 font-sans">{cat.description}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* CUSTOMER TESTIMONIALS (from /api/testimonials) */}
      <Testimonials />

      {/* STATS FOOTER */}
      <section className="py-16 px-6 bg-sand border-t border-primary/5">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { label: 'Total Clocks Designed', value: '24+' },
            { label: 'Happy Customers', value: '3,200+' },
            { label: 'Avg. Rating', value: '4.9 ★' },
            { label: 'Cities Shipped', value: '18+' },
          ].map((stat, i) => (
            <div key={i}>
              <p className="text-3xl md:text-4xl font-serif font-bold text-primary">{stat.value}</p>
              <p className="text-xs text-primary/40 uppercase tracking-widest mt-1 font-bold">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
