import { Suspense, lazy, ComponentType, ReactNode, useEffect } from 'react';
import { Switch, Route, useParams, Router as WouterRouter, useLocation } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/lib/theme-provider';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CookieConsent from '@/components/CookieConsent';
import ErrorBoundary from '@/components/ErrorBoundary';
import { categories, tools } from '@/lib/tools';
import KrynnIcon from '@/components/common/KrynnIcon';
import { Lightning } from '@phosphor-icons/react';

import HomePageComponent from './app/page';

const queryClient = new QueryClient();

const _BlogPage         = lazy(() => import('./app/blog/page'));
const _AboutPage        = lazy(() => import('./app/about/page'));
const _ContactPage      = lazy(() => import('./app/contact/page'));
const _PrivacyPage      = lazy(() => import('./app/privacy-policy/page'));
const _TermsPage        = lazy(() => import('./app/terms-of-service/page'));
const _CookiePolicyPage = lazy(() => import('./app/cookie-policy/page'));
const _DisclaimerPage   = lazy(() => import('./app/disclaimer/page'));
const _SlugPage         = lazy(() => import('./app/[slug]/page'));

const toolModules = import.meta.glob('./app/*/*/page.tsx') as Record<string, () => Promise<{ default: ComponentType<unknown> }>>;
const blogModules = import.meta.glob('./app/blog/*/page.tsx') as Record<string, () => Promise<{ default: ComponentType<unknown> }>>;
const categoryModules = import.meta.glob('./app/*/page.tsx') as Record<string, () => Promise<{ default: ComponentType<unknown> }>>;

const lazyCache = new Map<string, ComponentType<unknown>>();

function getOrCreateLazy(key: string, modules: Record<string, () => Promise<{ default: ComponentType<unknown> }>>): ComponentType<unknown> | null {
  if (lazyCache.has(key)) return lazyCache.get(key)!;
  const loader = modules[key];
  if (!loader) return null;
  const C = lazy(loader);
  lazyCache.set(key, C);
  return C;
}

const PageSpinner = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="spinner" />
  </div>
);

const NotFoundPage = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-6">
    <h1 className="text-6xl font-extrabold text-primary">404</h1>
    <p className="text-muted-foreground text-lg">Page not found</p>
    <a href="/" className="btn-primary mt-2">← Back to Home</a>
  </div>
);

function LazyPage({ Page }: { Page: ComponentType<unknown> | null }) {
  if (!Page) return <NotFoundPage />;
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageSpinner />}>
        <Page />
      </Suspense>
    </ErrorBoundary>
  );
}

// ── SEO: Update document title on route change ──
function SeoUpdater() {
  const [pathname] = useLocation();

  useEffect(() => {
    const tool = tools.find(t => {
      const cat = categories.find(c => c.slug === t.categorySlug);
      return cat && pathname === `/${t.categorySlug}/${t.slug}`;
    });

    const category = categories.find(c => pathname === `/${c.slug}`);

    if (tool) {
      document.title = `${tool.name} — Free Online Tool | Krynn Tools`;
      const meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute('content', tool.description);
    } else if (category) {
      document.title = `${category.name} Tools — Free Online | Krynn Tools`;
      const meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute('content', `${category.description} Free, fast, runs in your browser.`);
    } else if (pathname === '/') {
      document.title = 'Krynn Tools — 100+ Free Online Tools';
      const meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute('content', '100+ free online tools for PDF, Image, Text, Developer, Design, Calculators & Security. Fast, private, runs in your browser.');
    } else {
      document.title = 'Krynn Tools — 100+ Free Online Tools';
    }
  }, [pathname]);

  return null;
}

function HomePage()         { return <HomePageComponent />; }
function BlogPage()         { return <LazyPage Page={_BlogPage} />; }
function AboutPage()        { return <LazyPage Page={_AboutPage} />; }
function ContactPage()      { return <LazyPage Page={_ContactPage} />; }
function PrivacyPage()      { return <LazyPage Page={_PrivacyPage} />; }
function TermsPage()        { return <LazyPage Page={_TermsPage} />; }
function CookiePolicyPage() { return <LazyPage Page={_CookiePolicyPage} />; }
function DisclaimerPage()   { return <LazyPage Page={_DisclaimerPage} />; }

function BlogPostRoute() {
  const { slug } = useParams<{ slug: string }>();
  const Page = getOrCreateLazy(`./app/blog/${slug}/page.tsx`, blogModules);
  return <LazyPage Page={Page} />;
}

function ToolRoute() {
  const { category, tool } = useParams<{ category: string; tool: string }>();
  const Page = getOrCreateLazy(`./app/${category}/${tool}/page.tsx`, toolModules);
  return <LazyPage Page={Page} />;
}

function CategoryOrSlugRoute() {
  const { slug } = useParams<{ slug: string }>();
  const specificKey = `./app/${slug}/page.tsx`;
  const specificPage = getOrCreateLazy(specificKey, categoryModules);
  return <LazyPage Page={specificPage ?? _SlugPage} />;
}

function AppLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <SeoUpdater />
      <Header />
      <main className="min-h-[calc(100vh-4rem)] pb-[calc(72px+env(safe-area-inset-bottom,0px))] md:pb-0">
        {children}
      </main>
      <Footer />
      <CookieConsent />
    </ThemeProvider>
  );
}

function AppRouter() {
  return (
    <AppLayout>
      <ErrorBoundary>
        <Switch>
          <Route path="/"                 component={HomePage} />
          <Route path="/blog"             component={BlogPage} />
          <Route path="/blog/:slug"       component={BlogPostRoute} />
          <Route path="/about"            component={AboutPage} />
          <Route path="/contact"          component={ContactPage} />
          <Route path="/privacy-policy"   component={PrivacyPage} />
          <Route path="/terms-of-service" component={TermsPage} />
          <Route path="/cookie-policy"    component={CookiePolicyPage} />
          <Route path="/disclaimer"       component={DisclaimerPage} />
          <Route path="/:category/:tool"  component={ToolRoute} />
          <Route path="/:slug"            component={CategoryOrSlugRoute} />
          <Route component={NotFoundPage} />
        </Switch>
      </ErrorBoundary>
    </AppLayout>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
        <AppRouter />
      </WouterRouter>
    </QueryClientProvider>
  );
}
