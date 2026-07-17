import fs from "fs/promises";
import path from "path";
import { existsSync } from "fs";
import { categories, tools } from "../src/lib/tools.ts";
import { blogPosts } from "../src/lib/blog-data.ts";

const BASE_URL = "https://www.krynntools.online";
const DIST_DIR = path.resolve(import.meta.dirname, "../dist/public");
const INDEX_HTML_PATH = path.join(DIST_DIR, "index.html");

interface PrerenderUrl {
  path: string;
  title: string;
  desc: string;
  keywords: string;
  type: "home" | "category" | "tool" | "static" | "blog" | "news";
  name: string;
  schema?: object;
  extra?: any;
}

/** Escape special HTML characters so they are safe inside attribute values. */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** Generates search-engine friendly static body content for crawlers. */
function generateStaticBody(type: string, name: string, desc: string, extra: any = {}): string {
  const categoriesList = categories.map(c => `<li><a href="/${c.slug}">${c.name}</a></li>`).join("\n          ");
  
  let mainContent = "";
  
  if (type === "home") {
    const popularToolsList = tools.filter(t => t.popular).slice(0, 12).map(t => 
      `<li>
          <a href="/${t.categorySlug}/${t.slug}">
            <h3>${t.name}</h3>
            <p>${t.description}</p>
          </a>
        </li>`
    ).join("\n        ");
    mainContent = `
      <section>
        <h1>The Best Free Online Tools in 2026</h1>
        <p>${desc}</p>
        <h2>Popular Tools</h2>
        <ul>
          ${popularToolsList}
        </ul>
      </section>
    `;
  } else if (type === "category") {
    const catTools = tools.filter(t => t.categorySlug === extra.slug).map(t =>
      `<li>
          <a href="/${t.categorySlug}/${t.slug}">
            <h3>${t.name}</h3>
            <p>${t.description}</p>
          </a>
        </li>`
    ).join("\n        ");
    mainContent = `
      <section>
        <h1>${name}</h1>
        <p>${desc}</p>
        <h2>Available ${name}</h2>
        <ul>
          ${catTools}
        </ul>
      </section>
    `;
  } else if (type === "tool") {
    const catSlug = extra.categorySlug || "";
    let localInstructions = "";
    let localBenefits = "";
    let localFaqs = "";
    
    if (catSlug === "pdf") {
      localInstructions = `
        <li>Select or drag and drop your PDF file into the drop zone.</li>
        <li>Configure options, ranges, text overlays, or security settings locally in the interface.</li>
        <li>Click the action button. The files are modified entirely inside your browser memory.</li>
        <li>Preview the modified document and download your processed PDF file instantly.</li>
      `;
      localBenefits = `
        <li><strong>Zero Upload Privacy:</strong> Processing runs 100% locally via WebAssembly. Your confidential PDF contents never leave your device.</li>
        <li><strong>No File Size or Task Limits:</strong> Merge, split, or compress documents of any size without limitations or registration requirements.</li>
        <li><strong>No Watermark Branding:</strong> Download pristine, clean PDFs with no watermark overlays.</li>
      `;
      localFaqs = `
        <h3>Are my PDF documents uploaded to your servers?</h3>
        <p>No. Krynn Tools runs client-side processing using <code>pdf-lib</code> inside your browser. Your files never hit our servers or networks.</p>
        <h3>Does the PDF compressor degrade document layouts?</h3>
        <p>No. Layout boundaries and vector elements are preserved while embedded raster images are optimized to maintain readability at a fraction of the file size.</p>
        <h3>Can I merge encrypted PDF files?</h3>
        <p>You can merge password-protected files, provided you unlock them using our <em>Unlock PDF</em> tool first to decrypt the PDF streams locally.</p>
      `;
    } else if (catSlug === "image") {
      localInstructions = `
        <li>Drag and drop your image (JPEG, PNG, WebP, GIF, or raw HEIC) into the selector.</li>
        <li>Set output dimensions, quality percentages, or crop handles.</li>
        <li>The Canvas API processes and compresses the graphic streams in real time.</li>
        <li>Download the customized, lightweight output image instantly.</li>
      `;
      localBenefits = `
        <li><strong>Lossless & Lossy Options:</strong> Fine-tune image parameters with real-time browser preview comparisons.</li>
        <li><strong>Private Processing:</strong> Canvas modifications execute in sandbox local memory, making it safe for personal photographs.</li>
        <li><strong>Multiple Format Support:</strong> Convert easily between PNG, JPG, WebP, TIFF, PSD, and camera RAW formats.</li>
      `;
      localFaqs = `
        <h3>Does background removal preserve transparent layers?</h3>
        <p>Yes. Background removal exports to PNG with a fully transparent alpha channel, ideal for web design and presentations.</p>
        <h3>Are my photos saved on a database?</h3>
        <p>No. Your photos are converted into base64 or temporary blobs inside your browser's local sandbox and are destroyed as soon as you close the tab.</p>
        <h3>Can I batch process multiple images at once?</h3>
        <p>Yes, tools like our Bulk Image Resizer process multiple image canvases in parallel directly in your browser.</p>
      `;
    } else if (catSlug === "dev") {
      localInstructions = `
        <li>Paste your raw data, query, JSON string, or file content into the code editor panel.</li>
        <li>Select validation, minification, formatting options, or generation schema keys.</li>
        <li>The utility immediately parses the tokens and shows structured results.</li>
        <li>Copy the outputs to your clipboard or download them as raw text files.</li>
      `;
      localBenefits = `
        <li><strong>Developer-Focused Security:</strong> Safe formatting for API keys, client configs, and database connection strings without network leak risks.</li>
        <li><strong>Syntax Highlighting & Error Tracking:</strong> Highlights exact syntax error line numbers instantly.</li>
        <li><strong>Offline Support:</strong> Works perfectly on local networks without active internet connections.</li>
      `;
      localFaqs = `
        <h3>Is my sensitive JSON or connection string sent to an API?</h3>
        <p>No. Everything is parsed inside local JavaScript memory, ensuring zero network exposure for API tokens or environment configurations.</p>
        <h3>Do validation errors show lines?</h3>
        <p>Yes, JSON parser highlights the exact token mismatch and line number for debug convenience.</p>
        <h3>Are formatting styles customizable?</h3>
        <p>Yes, tools like SQL Formatter support custom indentations and syntax highlighting preferences.</p>
      `;
    } else if (catSlug === "ai-writing") {
      localInstructions = `
        <li>Type your topic, instructions, outline prompts, or paste text in the field.</li>
        <li>Adjust tone settings (Professional, Casual, Creative) and choose desired outputs.</li>
        <li>The AI generates original drafts and formats paragraph blocks instantly.</li>
        <li>Edit the text right in the browser, copy to clipboard, or save.</li>
      `;
      localBenefits = `
        <li><strong>Zero Account Creation:</strong> No signups, no subscriptions, and no trial limits. Generates text instantly.</li>
        <li><strong>Gemini Powered Quality:</strong> Uses clean prompts to craft high-quality professional documents.</li>
        <li><strong>Privacy Guarded:</strong> Prompts are passed to a secure proxy that does not log or store queries.</li>
      `;
      localFaqs = `
        <h3>Are my prompts used to train AI models?</h3>
        <p>No. Requests are routed through clean developer APIs where data storage and model training options are fully opted out.</p>
        <h3>Do I need to sign up for an API key?</h3>
        <p>No, Krynn Tools handles all key authorization securely in a backend proxy so you can start writing immediately.</p>
        <h3>Can I generate unlimited text content?</h3>
        <p>Yes, our AI writing suite is fully free to use without standard daily query caps or prompt restrictions.</p>
      `;
    } else {
      localInstructions = `
        <li>Open the ${name} interface on your device.</li>
        <li>Type your values, choose unit parameters, or drop files.</li>
        <li>Calculations and conversions process instantly as you change inputs.</li>
        <li>Copy or download your finalized outputs.</li>
      `;
      localBenefits = `
        <li><strong>No Limits:</strong> Run calculators and utility processes infinitely.</li>
        <li><strong>Browser Running:</strong> Zero installs, zero permissions required.</li>
        <li><strong>Fast Results:</strong> Local client script calculations respond in real time.</li>
      `;
      localFaqs = `
        <h3>Are results accurate?</h3>
        <p>Yes. All formulas, converter constants, and generators are fully tested and validated against global standard parameters.</p>
        <h3>Can I run this offline?</h3>
        <p>Yes, once loaded, these tools run 100% in client-side memory even if you lose network connectivity.</p>
        <h3>Is any data cached on a remote server?</h3>
        <p>No, calculations and file operations are completely transient and isolated in your local javascript context.</p>
      `;
    }

    mainContent = `
      <article>
        <h1>${name}</h1>
        <p>${desc}</p>
        
        <h2>How to Use ${name}</h2>
        <ol>
          ${localInstructions}
        </ol>

        <h2>Why Choose Krynn Tools for ${name}?</h2>
        <ul>
          ${localBenefits}
        </ul>

        <h2>Frequently Asked Questions</h2>
        <div>
          ${localFaqs}
        </div>
      </article>
    `;
  } else if (type === "blog") {
    mainContent = `
      <article>
        <h1>${name}</h1>
        <p>${desc}</p>
        <div>${extra.content || ""}</div>
      </article>
    `;
  } else {
    mainContent = `
      <section>
        <h1>${name}</h1>
        <p>${desc}</p>
      </section>
    `;
  }

  return `
    <header style="padding: 1rem; border-bottom: 1px solid #eee;">
      <nav style="display: flex; justify-content: space-between; max-width: 1200px; margin: 0 auto;">
        <a href="/"><strong>Krynn Tools</strong></a>
        <ul style="display: flex; gap: 1rem; list-style: none; margin: 0; padding: 0;">
          <li><a href="/pdf">PDF Tools</a></li>
          <li><a href="/image">Image Tools</a></li>
          <li><a href="/text">Text Tools</a></li>
          <li><a href="/dev">Developer Tools</a></li>
          <li><a href="/blog">Blog</a></li>
        </ul>
      </nav>
    </header>
    <main style="max-width: 800px; margin: 2rem auto; padding: 0 1rem; line-height: 1.6;">
      ${mainContent}
    </main>
    <footer style="margin-top: 4rem; padding: 2rem 1rem; border-top: 1px solid #eee; background: #fafafa; font-size: 0.9rem;">
      <div style="max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem;">
        <div>
          <h4>Tool Categories</h4>
          <ul style="list-style: none; padding: 0; line-height: 1.8;">
            ${categoriesList}
          </ul>
        </div>
        <div>
          <h4>Information</h4>
          <ul style="list-style: none; padding: 0; line-height: 1.8;">
            <li><a href="/about">About Us</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/privacy-policy">Privacy Policy</a></li>
            <li><a href="/terms-of-service">Terms of Service</a></li>
          </ul>
        </div>
      </div>
      <div style="max-width: 1200px; margin: 2rem auto 0; text-align: center; color: #666; font-size: 0.8rem;">
        <p>&copy; 2026 Krynn Tools. All rights reserved. Processed locally for your privacy.</p>
      </div>
    </footer>
  `;
}

async function prerender() {
  try {
    // 1. Read index.html shell generated by Vite
    const indexHtml = await fs.readFile(INDEX_HTML_PATH, "utf-8");

    const urls: PrerenderUrl[] = [];

    const defaultKeywords = "free online tools, PDF tools, image compressor, remove background, QR code generator, resume builder, AI writing tools, grammar checker, word counter, JSON formatter, base64 encoder, password generator, BMI calculator, unit converter, file converter, image upscaler, OCR, text to speech, plagiarism checker";

    // --- Homepage ---
    urls.push({
      path: "",
      title: "Krynn Tools — 140+ Free Online Tools | PDF, Image, AI, Converter",
      desc: "140+ free online tools — Compress PDF, Remove Background, Image Upscaler, Resume Builder, QR Code Generator, AI Writing Tools, and more. No signup required. Runs in your browser.",
      keywords: defaultKeywords,
      type: "home",
      name: "Krynn Tools"
    });

    // --- Static Pages ---
    const staticPages = [
      {
        slug: "about",
        title: "About Us | Krynn Tools",
        desc: "Learn more about Krynn Tools, our values, and our privacy-first local browser execution model."
      },
      {
        slug: "contact",
        title: "Contact Us | Krynn Tools",
        desc: "Get in touch with the Krynn Tools support team for suggestions, bug reports, or partnerships."
      },
      {
        slug: "blog",
        title: "Blog & Tutorials | Krynn Tools",
        desc: "Tips, guides, and tutorials for getting the most out of free online tools. Read our detailed write-ups."
      },
      {
        slug: "privacy-policy",
        title: "Privacy Policy | Krynn Tools",
        desc: "Our privacy policy explaining how we guarantee your file security by running everything locally inside your browser."
      },
      {
        slug: "terms-of-service",
        title: "Terms of Service | Krynn Tools",
        desc: "Read the terms of service agreement for using Krynn Tools online utility tools."
      },
      {
        slug: "cookie-policy",
        title: "Cookie Policy | Krynn Tools",
        desc: "Understand how we use cookies and caching to speed up your local browser utility executions."
      },
      {
        slug: "disclaimer",
        title: "Disclaimer | Krynn Tools",
        desc: "Disclaimer terms regarding calculations, conversions, and output files from Krynn Tools."
      }
    ];

    staticPages.forEach((p) => {
      urls.push({
        path: p.slug,
        title: p.title,
        desc: p.desc,
        keywords: `${p.title.toLowerCase().replace(" | krynn tools", "")}, free online tools, krynn tools`,
        type: "static",
        name: p.title.split(" | ")[0]
      });
    });

    // --- Comparison / Alternative Landing Pages ---
    const comparisonPages = [
      {
        slug: "ilovepdf-alternative",
        title: "Best Free iLovePDF Alternative 2026 — No Upload, No Limits | Krynn Tools",
        desc: "Krynn Tools is the best free iLovePDF alternative. 20+ PDF tools with no file uploads, no sign-up, no rate limits, and 100% private browser-side processing.",
        keywords: "ilovepdf alternative, ilovepdf free alternative, free pdf tools online, ilovepdf no upload alternative, krynn tools"
      },
      {
        slug: "smallpdf-alternative",
        title: "Best Free Smallpdf Alternative 2026 — Unlimited, No Sign-up | Krynn Tools",
        desc: "Tired of Smallpdf's 2-task/day limit? Krynn Tools is a free Smallpdf alternative with unlimited PDF tools, no uploads, no sign-up, and complete privacy.",
        keywords: "smallpdf alternative, smallpdf free alternative, free pdf tools unlimited, smallpdf no limit alternative, krynn tools"
      },
    ];
    comparisonPages.forEach((p) => {
      const schema = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": p.title,
        "description": p.desc,
        "url": `${BASE_URL}/${p.slug}`,
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": BASE_URL },
            { "@type": "ListItem", "position": 2, "name": p.title.split(" — ")[0], "item": `${BASE_URL}/${p.slug}` }
          ]
        }
      };
      urls.push({
        path: p.slug,
        title: p.title,
        desc: p.desc,
        keywords: p.keywords,
        type: "static",
        name: p.title.split(" — ")[0],
        schema
      });
    });

    // --- Category Pages ---
    categories.forEach((cat) => {
      urls.push({
        path: cat.slug,
        title: `${cat.name} Online Free — No Signup Required | Krynn Tools`,
        desc: `Free online ${cat.name.toLowerCase()} — ${cat.description} 100% free, no signup, no watermark. All tools run in your browser for instant & private results.`,
        keywords: `${cat.name.toLowerCase()}, free online ${cat.name.toLowerCase()}, browser based ${cat.name.toLowerCase()}, krynn tools`,
        type: "category",
        name: cat.name,
        extra: { slug: cat.slug }
      });
    });

    // --- Tool Pages ---
    tools.forEach((tool) => {
      const toolTitle = tool.seoTitle || `${tool.name} Online Free — No Signup | Krynn Tools`;
      const toolDesc = tool.seoDescription || `${tool.description} Free, fast, and private — runs entirely in your browser. No signup, no watermark, no file size limits. Try it now!`;
      
      const schema = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": tool.name,
        "operatingSystem": "Web Browser",
        "applicationCategory": "UtilityApplication",
        "featureList": tool.keywords?.slice(0, 5).join(", ") || tool.description,
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "description": tool.description,
        "url": `${BASE_URL}/${tool.categorySlug}/${tool.slug}`
      };

      urls.push({
        path: `${tool.categorySlug}/${tool.slug}`,
        title: toolTitle,
        desc: toolDesc,
        keywords: tool.keywords.slice(0, 15).join(", "),
        type: "tool",
        name: tool.name,
        schema,
        extra: { categorySlug: tool.categorySlug }
      });
    });

    // --- Blog Pages ---
    blogPosts.forEach((post) => {
      const schema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": post.title,
        "description": post.description,
        "image": post.image?.startsWith("/")
          ? `${BASE_URL}${post.image}`
          : post.image || `${BASE_URL}/og-default.png`,
        "datePublished": post.date,
        "dateModified": post.date,
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": `${BASE_URL}/blog/${post.slug}`
        },
        "author": {
          "@type": "Person",
          "name": "Krynn Tools Team"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Krynn Tools",
          "logo": {
            "@type": "ImageObject",
            "url": `${BASE_URL}/logo.png`
          }
        }
      };

      const blogKeywords = `${post.title.toLowerCase().replace(/ - /g, ", ").replace(/ /g, ", ")}, krynn tools blog`;

      urls.push({
        path: `blog/${post.slug}`,
        title: post.title,
        desc: post.description,
        keywords: blogKeywords,
        type: "blog",
        name: post.title,
        schema
      });
    });

    // --- Trending News Pages ---
    try {
      const newsDataPath = path.resolve(import.meta.dirname, "../public/trending-news/data.json");
      if (existsSync(newsDataPath)) {
        const newsRaw = await fs.readFile(newsDataPath, "utf-8");
        const newsData = JSON.parse(newsRaw);
        if (newsData && Array.isArray(newsData.articles)) {
          // Pre-render trending-news hub
          urls.push({
            path: "trending-news",
            title: "Trending Tech News — AI, Technology & Cybersecurity | Krynn Tools",
            desc: "Stay ahead with the latest in technology, AI, and cybersecurity. Curated from TechCrunch, The Verge, WIRED, and more — updated automatically.",
            keywords: "trending tech news, ai news, technology news, cybersecurity news, tech article aggregator",
            type: "static",
            name: "Trending Tech News"
          });

          // Pre-render individual news articles
          newsData.articles.forEach((article: any) => {
            const schema = {
              "@context": "https://schema.org",
              "@type": "NewsArticle",
              "headline": article.title,
              "description": article.summary,
              "image": article.image || undefined,
              "datePublished": article.publishedAt,
              "dateModified": article.publishedAt,
              "author": {
                "@type": "Organization",
                "name": article.source
              },
              "publisher": {
                "@type": "Organization",
                "name": "Krynn Tools",
                "url": BASE_URL,
                "logo": {
                  "@type": "ImageObject",
                  "url": `${BASE_URL}/logo.png`
                }
              },
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": `${BASE_URL}/trending-news/${article.slug}`
              }
            };

            const newsKeywords = article.tags ? [...article.tags, article.category].join(", ") : article.category;

            urls.push({
              path: `trending-news/${article.slug}`,
              title: `${article.title} | Krynn Tools`,
              desc: article.summary,
              keywords: newsKeywords,
              type: "news",
              name: article.title,
              schema
            });
          });
        }
      }
    } catch (e) {
      console.error("Failed to prerender trending news:", e);
    }

    // Prerender loop
    for (const item of urls) {
      const fullUrl = item.path ? `${BASE_URL}/${item.path}` : `${BASE_URL}/`;
      
      let html = indexHtml;

      // Escape values before injecting into HTML attributes
      const safeTitle = escapeHtml(item.title);
      const safeDesc = escapeHtml(item.desc);
      const safeKeywords = escapeHtml(item.keywords);

      // Replace metadata
      html = html.replace(/<title>.*?<\/title>/g, `<title>${safeTitle}</title>`);
      html = html.replace(/<meta name="description" content=".*?" \/>/g, `<meta name="description" content="${safeDesc}" />`);
      html = html.replace(/<meta name="keywords" content=".*?" \/>/g, `<meta name="keywords" content="${safeKeywords}" />`);
      html = html.replace(/<meta property="og:title" content=".*?" \/>/g, `<meta property="og:title" content="${safeTitle}" />`);
      html = html.replace(/<meta property="og:description" content=".*?" \/>/g, `<meta property="og:description" content="${safeDesc}" />`);
      html = html.replace(/<meta property="og:url" content=".*?" \/>/g, `<meta property="og:url" content="${fullUrl}" />`);
      html = html.replace(/<meta name="twitter:title" content=".*?" \/>/g, `<meta name="twitter:title" content="${safeTitle}" />`);
      html = html.replace(/<meta name="twitter:description" content=".*?" \/>/g, `<meta name="twitter:description" content="${safeDesc}" />`);
      html = html.replace(/<link rel="canonical" href=".*?" \/>/g, `<link rel="canonical" href="${fullUrl}" />`);
      html = html.replace(/<link rel="alternate" hreflang="en" href=".*?" \/>/g, `<link rel="alternate" hreflang="en" href="${fullUrl}" />`);
      html = html.replace(/<link rel="alternate" hreflang="x-default" href=".*?" \/>/g, `<link rel="alternate" hreflang="x-default" href="${fullUrl}" />`);
      
      // Inject hreflang en-IN so Google knows this English content serves Indian users
      if (!html.includes('hreflang="en-IN"')) {
        html = html.replace(
          `<link rel="alternate" hreflang="en" href="${fullUrl}" />`,
          `<link rel="alternate" hreflang="en" href="${fullUrl}" />\n    <link rel="alternate" hreflang="en-IN" href="${fullUrl}" />`
        );
      }

      // Inject extra schemas if present
      if (item.schema) {
        const schemaString = `\n    <script type="application/ld+json">\n    ${JSON.stringify(item.schema, null, 2).replace(/\n/g, "\n    ")}\n    </script>`;
        html = html.replace("</head>", `${schemaString}\n  </head>`);
      }

      // Inject static semantic body inside <div id="root"></div> for indexing
      const staticBodyHtml = generateStaticBody(item.type, item.name, item.desc, item.extra || {});
      html = html.replace('<div id="root"></div>', `<div id="root">${staticBodyHtml}</div>`);

      // Write output
      if (item.path === "") {
        // Overwrite root index.html
        await fs.writeFile(INDEX_HTML_PATH, html, "utf-8");
      } else {
        // Output to path.html so Vercel cleanUrls maps /path directly to path.html
        const outPath = path.join(DIST_DIR, `${item.path}.html`);
        const outDir = path.dirname(outPath);
        await fs.mkdir(outDir, { recursive: true });
        await fs.writeFile(outPath, html, "utf-8");
      }
    }

    console.log(`Successfully pre-rendered ${urls.length} pages in dist/public/ for SEO!`);
  } catch (err) {
    console.error("Prerendering failed:", err);
  }
}

prerender().catch(console.error);
