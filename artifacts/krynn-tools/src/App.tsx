import { Suspense, lazy, ComponentType, ReactNode } from 'react';
import { Switch, Route, useParams, Router as WouterRouter } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/lib/theme-provider';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CookieConsent from '@/components/CookieConsent';
import ErrorBoundary from '@/components/ErrorBoundary';

// ── Home page is EAGERLY imported — renders on first paint, no spinner. ───────
import HomePageComponent from './app/page';

const queryClient = new QueryClient();

// ── All other pages are lazily code-split. ───────────────────────────────────
// Direct lazy() imports give Vite explicit split points (better DX than glob).
const _BlogPage         = lazy(() => import('./app/blog/page'));
const _AboutPage        = lazy(() => import('./app/about/page'));
const _ContactPage      = lazy(() => import('./app/contact/page'));
const _PrivacyPage      = lazy(() => import('./app/privacy-policy/page'));
const _TermsPage        = lazy(() => import('./app/terms-of-service/page'));
const _CookiePolicyPage = lazy(() => import('./app/cookie-policy/page'));
const _DisclaimerPage   = lazy(() => import('./app/disclaimer/page'));
const _SlugPage         = lazy(() => import('./app/[slug]/page'));

// ── Dynamic discovery for tool + blog-post routes ────────────────────────────
const toolModules = import.meta.glob('./app/*/*/page.tsx') as Record<
  string,
  () => Promise<{ default: ComponentType<unknown> }>
>;
const blogModules = import.meta.glob('./app/blog/*/page.tsx') as Record<
  string,
  () => Promise<{ default: ComponentType<unknown> }>
>;
const categoryModules = import.meta.glob('./app/*/page.tsx') as Record<
  string,
  () => Promise<{ default: ComponentType<unknown> }>
>;

// Cache lazy components so React sees a stable reference across renders —
// critical for Suspense: a new component type forces an unnecessary remount.
const lazyCache = new Map<string, ComponentType<unknown>>();

function getOrCreateLazy(
  key: string,
  modules: Record<string, () => Promise<{ default: ComponentType<unknown> }>>
): ComponentType<unknown> | null {
  if (lazyCache.has(key)) return lazyCache.get(key)!;
  const loader = modules[key];
  if (!loader) return null;
  const C = lazy(loader);
  lazyCache.set(key, C);
  return C;
}

// ── Loading spinner ───────────────────────────────────────────────────────────
const PageSpinner = () => (
  <div
    style={{
      minHeight: '60vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <div className="spinner" />
  </div>
);

// ── 404 ──────────────────────────────────────────────────────────────────────
const NotFoundPage = () => (
  <div
    style={{
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '16px',
      textAlign: 'center',
      padding: '0 24px',
    }}
  >
    <h1 style={{ fontSize: '5rem', fontWeight: 800, color: 'var(--color-primary)', lineHeight: 1 }}>
      404
    </h1>
    <p style={{ color: 'var(--color-muted-foreground)', fontSize: '1.125rem' }}>
      Page not found
    </p>
    <a
      href="/"
      style={{
        marginTop: '8px', padding: '10px 24px', borderRadius: '10px',
        background: 'var(--color-primary)', color: '#fff',
        fontWeight: 600, fontSize: '0.9375rem',
      }}
    >
      ← Back to Home
    </a>
  </div>
);

// ── Lazy page wrapper — wraps with Suspense + ErrorBoundary ──────────────────
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

// ── Static route components — defined at module scope for stable refs ─────────
// Never define these inline (e.g. component={() => ...}): React treats new
// function references as new component types and remounts the subtree,
// resetting Suspense and losing state.
function HomePage()         { return <HomePageComponent />; }
function BlogPage()         { return <LazyPage Page={_BlogPage} />; }
function AboutPage()        { return <LazyPage Page={_AboutPage} />; }
function ContactPage()      { return <LazyPage Page={_ContactPage} />; }
function PrivacyPage()      { return <LazyPage Page={_PrivacyPage} />; }
function TermsPage()        { return <LazyPage Page={_TermsPage} />; }
function CookiePolicyPage() { return <LazyPage Page={_CookiePolicyPage} />; }
function DisclaimerPage()   { return <LazyPage Page={_DisclaimerPage} />; }

// ── Dynamic routes ────────────────────────────────────────────────────────────
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

// ── App layout ────────────────────────────────────────────────────────────────
function AppLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <Header />
      {/*
        pb-safe-nav: On mobile, the bottom nav is 64px + safe-area-inset-bottom.
        On md+ screens the bottom nav is hidden (md:hidden) so no padding needed.
      */}
      <main className="min-h-[calc(100vh-4rem)] pb-[calc(72px+env(safe-area-inset-bottom,0px))] md:pb-0">
        {children}
      </main>
      <Footer />
      <CookieConsent />
    </ThemeProvider>
  );
}

// ── Router ────────────────────────────────────────────────────────────────────
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
          {/* Two-segment paths are tools; must be registered before /:slug */}
          <Route path="/:category/:tool"  component={ToolRoute} />
          {/* One-segment paths are category listings or other pages */}
          <Route path="/:slug"            component={CategoryOrSlugRoute} />
          <Route component={NotFoundPage} />
        </Switch>
      </ErrorBoundary>
    </AppLayout>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
        <AppRouter />
      </WouterRouter>
    </QueryClientProvider>
  );
}
