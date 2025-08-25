
# Blueprint.md  
**Professional Astro.js Blog with Built‑in CMS**  

---  

## 1. Project Vision  

| Goal | Description |
|------|-------------|
| **Fast, SEO‑friendly static site** | Leverage Astro’s island architecture + prerendered pages. |
| **Headless CMS for content editors** | Content creators work in a UI they control; developers get a clean API. |
| **Scalable & maintainable** | Component‑driven UI, TypeScript, CI/CD, and automated testing. |
| **Modern dev experience** | TailwindCSS, ESLint/Prettier, Storybook, and hot‑reloading. |
| **Future‑proof** | Easy to add i18n, search, comments, newsletters, or e‑commerce later. |

---  

## 2. High‑Level Architecture  

```
┌─────────────────────────────────────────────────────┐
│                         Browser                     │
│   (HTML + CSS + JS Islands)                         │
└───────────────▲───────────────────────▲─────────────┘
                │                       │
                │   HTTP(s) (static)   │
                ▼                       ▼
┌─────────────────────┐   ┌────────────────────────────┐
│   CDN / Edge (Vercel│   │  Headless CMS (e.g.,      │
│   / Netlify)        │   │  Contentful / Sanity)     │
└─────────────────────┘   └────────────────────────────┘
                │                       │
                │  API (REST/GraphQL)   │
                ▼                       ▼
      ┌───────────────────────┐   ┌───────────────────────┐
      │   Astro Build (Node)   │   │   CMS Webhooks        │
      │   – fetch content      │   │   – trigger rebuild   │
      │   – compile pages      │   └───────────────────────┘
      └───────────────────────┘
                │
                ▼
      ┌───────────────────────┐
      │   Static Assets (HTML,│
      │   CSS, JS, images)    │
      └───────────────────────┘
                │
                ▼
       Deployed to CDN (Vercel/Netlify)
```

* Astro builds **static HTML** for each blog post while hydrating interactive islands (e.g., comment widget).  
* The CMS stores structured content (posts, author bios, tags, SEO meta).  
* On content change the CMS fires a webhook → CI pipeline → rebuild → new static site is served instantly.

---  

## 3. Technology Stack  

| Layer | Tech | Why |
|-------|------|-----|
| **Framework** | **Astro 3.x** (SSR‑optional) | Zero‑JS by default, island architecture, first‑class MDX. |
| **Language** | TypeScript | Type safety across components and CMS clients. |
| **Styling** | TailwindCSS 3.x + PostCSS | Utility‑first, fast build, easy theming. |
| **Content** | **Headless CMS** – pick one (see §4) | UI for editors, API for developers, webhooks for rebuilds. |
| **Data Fetch** | `astro:fetch` + `contentful` / `sanity` SDKs | Server‑side fetch during build; can also use GraphQL. |
| **Image** | `astro-imagetools` (built‑in) | Automatic resizing, WebP/AVIF, lazy loading. |
| **SEO** | `astro-seo` or custom `<Head>` component | Structured data, Open Graph, JSON‑LD. |
| **Comments** | Giscus (GitHub Discussions) / Disqus / Utterances | Client‑side island, no backend. |
| **Search** | Algolia DocSearch (static index) or **MiniSearch** for client‑side. |
| **Analytics** | Plausible / Fathom (privacy‑first). |
| **Testing** | Vitest (unit) + Playwright (e2e) | Fast, headless, CI‑friendly. |
| **CI / CD** | GitHub Actions → Vercel / Netlify | Automatic rebuild on PR, merge, and CMS webhook. |
| **Version Control** | Git (GitHub) | Collaboration, code reviews, release tagging. |
| **Documentation** | Storybook for UI components | Self‑documenting UI library. |

---  

## 4. Choosing the CMS  

| CMS | Pricing | UI / Editing | API | Webhooks | Multi‑language | Notes |
|-----|--------|--------------|-----|----------|----------------|------|
| **Contentful** | Free tier (3 users, 5,000 records) → paid | Clean, field‑type flexibility | REST + GraphQL | ✅ | ✅ (via locales) | Ideal for large sites, great docs. |
| **Sanity** | Free tier (3 users, 10k docs) → paid | Real‑time editing, portable text | GROQ (GraphQL optional) | ✅ | ✅ via `i18n` plugin | Highly customizable schemas. |
| **Strapi (self‑hosted)** | Open‑source | Full admin UI, can be self‑hosted on Vercel/Netlify functions | REST + GraphQL | ✅ | ✅ via plugins | Gives you total control but adds a server. |
| **Netlify CMS (git‑based)** | Free | Markdown files in repo, UI over Git | Direct file access; no API | ✅ (via Netlify build) | ✅ via branch per locale | Perfect for small teams; no extra service cost. |
| **Ghost (headless)** | Free tier (limited) → paid | Simple blog‑centric UI | REST + GraphQL | ✅ | Limited | Good if you also need newsletter & memberships. |

> **Recommendation for MVP**: **Contentful** (or **Sanity**) – mature API, webhook support, and no server to manage. Switch later if needs change.

---  

## 5. Folder Structure  

```
/
├─ public/                    # Static files (favicon, robots.txt, etc.)
├─ src/
│  ├─ components/             # UI components (Header, Footer, Card, etc.)
│  │   ├─ ui/                 # Primitive UI (Button, Avatar)
│  │   ├─ blog/               # PostList, PostCard, PostLayout
│  │   └─ islands/            # Hydrated components (CommentWidget, Search)
│  ├─ layouts/                # Global page wrappers (BaseLayout.astro)
│  ├─ pages/
│  │   ├─ index.astro         # Home page
│  │   ├─ blog/
│  │   │   ├─ [slug].astro    # Dynamic blog post page
│  │   │   └─ page.astro      # Blog archive / pagination
│  │   └─ about.astro
│  ├─ lib/
│  │   ├─ cms/                # CMS client wrappers, types, queries
│  │   │   ├─ contentful.ts
│  │   │   └─ types.ts
│  │   └─ utils/              # Helpers (date, slugify, etc.)
│  ├─ styles/
│  │   └─ tailwind.css
│  ├─ config/
│  │   └─ astro.config.mjs
│  └─ data/
│      └─ siteMeta.ts         # Site‑wide metadata (title, description)
├─ .github/
│   └─ workflows/
│      └─ build-and-deploy.yml
├─ package.json
├─ tsconfig.json
├─ tailwind.config.cjs
└─ README.md
```

---  

## 6. Content Model (example for Contentful)

| Content Type | Fields | Description |
|--------------|--------|-------------|
| **Post** | `title (Short text)` <br> `slug (Slug)` <br> `excerpt (Short text)` <br> `body (Rich text / Markdown)` <br> `coverImage (Asset)` <br> `publishedAt (Date)` <br> `author (Reference → Author)` <br> `tags (Array of Symbols)` <br> `seoTitle (Short text)` <br> `seoDescription (Short text)` | Main article. |
| **Author** | `name (Short text)` <br> `bio (Rich text)` <br> `avatar (Asset)` <br> `twitter (Short text)` | Author profile. |
| **SiteSettings** | `siteTitle` <br> `siteDescription` <br> `logo` <br> `defaultOgImage` | Global SEO defaults. |

*Export a JSON or GraphQL schema for future reference.*  

---  

## 7. CMS Integration  

### 7.1 Install SDK  

```bash
# Contentful example
npm i contentful @contentful/rich-text-react-renderer
# Sanity example
npm i @sanity/client @portabletext/react
```

### 7.2 Create a typed client (`src/lib/cms/contentful.ts`)  

```ts
// src/lib/cms/contentful.ts
import { createClient, EntryCollection } from 'contentful';
import type { Document } from '@contentful/rich-text-types';
import type { Post, Author, SiteSettings } from './types';

const client = createClient({
  space: import.meta.env.PUBLIC_CONTENTFUL_SPACE_ID,
  accessToken: import.meta.env.CONTENTFUL_ACCESS_TOKEN,
  // Use CDN for prod, preview token for drafts
  host: import.meta.env.MODE === 'production' ? 'cdn.contentful.com' : 'preview.contentful.com',
});

/* --------------------------------------------------------------
   Fetch helpers – all run on the server during the Astro build
   -------------------------------------------------------------- */
export async function fetchPosts(): Promise<Post[]> {
  const res = await client.getEntries<Post>({
    content_type: 'post',
    order: '-fields.publishedAt',
    include: 2, // fetch linked author + assets
  });
  return res.items.map(mapPost);
}

export async function fetchPostBySlug(slug: string): Promise<Post | null> {
  const res = await client.getEntries<Post>({
    content_type: 'post',
    'fields.slug': slug,
    limit: 1,
    include: 2,
  });
  if (!res.items.length) return null;
  return mapPost(res.items[0]);
}

/* --------------------------------------------------------------
   Mapping layer – turn Contentful raw fields into app‑friendly types
   -------------------------------------------------------------- */
function mapPost(entry: Entry<Post>): Post {
  const { fields, sys } = entry;
  return {
    id: sys.id,
    title: fields.title,
    slug: fields.slug,
    excerpt: fields.excerpt,
    body: fields.body as Document, // rich‑text AST
    coverImage: fields.coverImage?.fields?.file?.url ?? '',
    publishedAt: fields.publishedAt,
    author: mapAuthor(fields.author),
    tags: fields.tags ?? [],
    seoTitle: fields.seoTitle ?? fields.title,
    seoDescription: fields.seoDescription ?? fields.excerpt,
  };
}

function mapAuthor(entry: Entry<Author>): Author {
  const { fields, sys } = entry;
  return {
    id: sys.id,
    name: fields.name,
    bio: fields.bio,
    avatar: fields.avatar?.fields?.file?.url ?? '',
    twitter: fields.twitter,
  };
}
```

### 7.3 Types (`src/lib/cms/types.ts`)  

```ts
export interface SiteSettings {
  siteTitle: string;
  siteDescription: string;
  logo: string;
  defaultOgImage: string;
}

export interface Author {
  id: string;
  name: string;
  bio: Document; // Contentful Rich Text
  avatar: string;
  twitter?: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: Document;
  coverImage: string;
  publishedAt: string; // ISO
  author: Author;
  tags: string[];
  seoTitle: string;
  seoDescription: string;
}
```

### 7.4 Using data in Astro pages  

```astro
---
// src/pages/blog/[slug].astro
import { fetchPostBySlug } from '../../lib/cms/contentful';
import { renderRichText } from '../../components/markdown/ContentfulRichText.astro';
import Layout from '../../layouts/BaseLayout.astro';
import CommentWidget from '../../components/islands/CommentWidget.astro';
import { Astro } from 'astro';

export const prerender = true; // static generation

const { slug } = Astro.params;
const post = await fetchPostBySlug(slug);

if (!post) {
  throw new Astro.redirect('/');
}
---
<Layout title={post.seoTitle} description={post.seoDescription} ogImage={post.coverImage}>
  <article class="prose lg:prose-xl mx-auto py-12">
    <h1>{post.title}</h1>
    <p class="text-gray-500 text-sm">
      {new Date(post.publishedAt).toLocaleDateString(undefined, { dateStyle: "long" })} — {post.author.name}
    </p>
    {post.coverImage && (
      <img
        src={post.coverImage}
        alt=""
        class="w-full rounded-md my-6"
        loading="lazy"
        srcset={post.coverImage + "?w=400 400w, " + post.coverImage + "?w=800 800w, " + post.coverImage + "?w=1200 1200w"}
        sizes="(max-width: 800px) 100vw, 800px"
      />
    )}
    <section class="blog-body">
      <ContentfulRichText document={post.body} />
    </section>
  </article>

  <!-- Hydrated comment widget (client‑only island) -->
  <CommentWidget slug={post.slug} />
</Layout>
```

---  

## 8. Core Pages  

| Page | Path | Responsibility |
|------|------|-----------------|
| **Home** | `/` | Hero, recent posts preview, newsletter CTA. |
| **Blog Archive** | `/blog/` | Paginated list of all posts, tag filters. |
| **Post** | `/blog/[slug]` | Render post content, SEO meta, comment island. |
| **About** | `/about/` | Static page with author bios (pull from CMS). |
| **RSS** | `/rss.xml` | Generated at build‑time from post collection. |
| **Sitemap** | `/sitemap.xml` | Auto‑generated via `astro-sitemap`. |
| **404** | `404.astro` | Friendly not‑found page. |

---  

## 9. Styling & Theming  

### 9.1 Tailwind setup  

```js
// tailwind.config.cjs
module.exports = {
  content: [
    "./src/**/*.astro",
    "./src/**/*.tsx",
    "./src/**/*.vue",
    "./src/**/*.svelte",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0d6efd",
        secondary: "#6c757d",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["Fira Code", "monospace"],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
```

### 9.2 Global CSS (`src/styles/tailwind.css`)  

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom prose styling for blog content */
.prose {
  @apply max-w-none;
}
```

### 9.3 Dark mode (optional)  

Add `class` strategy:  

```js
// tailwind.config.cjs (add)
darkMode: "class",
```

Add a tiny toggle component that toggles `document.documentElement.classList.toggle('dark')`.  

---  

## 10. SEO & Metadata  

Create a reusable `<Head>` component (`src/components/seo/SeoHead.astro`)  

```astro
---
// src/components/seo/SeoHead.astro
export interface Props {
  title: string;
  description: string;
  ogImage?: string;
  slug?: string; // for canonical URL
}
const { title, description, ogImage, slug } = Astro.props;
const siteUrl = import.meta.env.PUBLIC_SITE_URL;
---
<head>
  <title>{title} | {import.meta.env.PUBLIC_SITE_TITLE}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={`${siteUrl}/${slug ?? ''}`} />

  <!-- Open Graph -->
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:type" content="article" />
  <meta property="og:url" content={`${siteUrl}/${slug ?? ''}`} />
  {ogImage && <meta property="og:image" content={ogImage} />}

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  {ogImage && <meta name="twitter:image" content={ogImage} />}
</head>
```

Use in layout:  

```astro
---
// src/layouts/BaseLayout.astro
import SeoHead from '../components/seo/SeoHead.astro';
---
<html lang="en" class="bg-white text-gray-900 antialiased">
  <SeoHead 
    title={Astro.props.title}
    description={Astro.props.description}
    ogImage={Astro.props.ogImage}
    slug={Astro.props.slug}
  />
  <body class="flex flex-col min-h-screen">
    <Header />
    <main class="flex-1">{Astro.slots.default()}</main>
    <Footer />
  </body>
</html>
```

---  

## 11. Image Optimization  

Astro ships with `@astrojs/image`.  

```bash
npm i @astrojs/image
```

Add to `astro.config.mjs`  

```js
import { defineConfig } from 'astro/config';
import image from '@astrojs/image';

export default defineConfig({
  integrations: [image()],
});
```

Use in a component:  

```astro
---
// src/components/ui/ResponsiveImage.astro
import { Image } from 'astro:assets';
const { src, alt, class: cls } = Astro.props;
---
<Image src={src} alt={alt} class={cls} widths={[400, 800, 1200]} format="webp" loading="lazy" />
```

---  

## 12. Content Rendering (Rich Text → HTML)  

For Contentful rich text we can use the official renderer, customizing link handling, embedded assets, etc.  

```tsx
// src/components/markdown/ContentfulRichText.astro
---
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import type { Document } from '@contentful/rich-text-types';
export interface Props { document: Document; }
---
<div class="rich-text">
  {documentToReactComponents(Astro.props.document, {
    renderNode: {
      // Example for embedded assets
      "embedded-asset-block": (node) => {
        const url = node.data.target.fields.file.url;
        const alt = node.data.target.fields.title;
        return <img src={url} alt={alt} class="my-4 rounded" loading="lazy" />;
      },
    },
  })}
</div>
```

**Alternative**: Switch to MDX (`.mdx` files stored in repo) if you don’t need a headless CMS – just keep the same folder structure.

---  

## 13. Interactive Islands  

| Feature | Component | Nature |
|---------|-----------|--------|
| Comments | `CommentWidget` | Client‑only, loads Giscus script. |
| Search | `SearchBox` (MiniSearch) | Hydrated on the client, uses a static JSON index generated at build. |
| Theme toggle | `ThemeSwitcher` | Client‑only, persists in `localStorage`. |
| Newsletter signup | `NewsletterForm` | Submits to Mailchimp/ConvertKit via fetch. |

All islands use the `.astro` file with `client:load` or `client:idle`. Example:  

```astro
---
// src/components/islands/CommentWidget.astro
const { slug } = Astro.props;
---
<div client:load>
  <script src="https://giscus.app/client.js"
          data-repo="myorg/blog-comments"
          data-repo-id="R_kgDO..."
          data-category="Announcements"
          data-category-id="DIC_kw..."
          data-mapping="pathname"
          data-term={slug}
          data-theme="light"
          crossorigin="anonymous"
          async>
  </script>
</div>
```

---  

## 14. Performance & Audits  

| Checklist | How |
|-----------|-----|
| **Critical CSS** | Tailwind Purge (enabled by default). |
| **Lighthouse >90** | Test locally (`npm run build && npx serve dist`). |
| **Font Loading** | Use `font-display: swap` and preload key fonts. |
| **Cache-Control** | CDN defaults to immutable assets; add custom headers if needed. |
| **Bundle analysis** | `npm run astro build -- --analyze` (or `vite-bundle-analyzer`). |
| **Lazy‑load images & iframes** | `loading="lazy"` + Astro image component. |
| **Prefetch next pages** | `<link rel="prefetch" href="/blog/next-slug/">`. |

---  

## 15. Testing  

### 15.1 Unit tests (Vitest)

```bash
npm i -D vitest @vitest/ui @testing-library/astro
```

Example test for utility:

```ts
// tests/utils/slugify.test.ts
import { slugify } from '../../src/lib/utils/slugify';

test('slugify removes special chars', () => {
  expect(slugify('Hello World!')).toBe('hello-world');
});
```

### 15.2 End‑to‑end (Playwright)

```bash
npx playwright install
npm i -D @playwright/test
```

Sample test:

```ts
// tests/e2e/home.spec.ts
import { test, expect } from '@playwright/test';

test('home page shows recent posts', async ({ page }) => {
  await page.goto('/');
  const posts = await page.locator('article[data-post]').count();
  expect(posts).toBeGreaterThan(0);
});
```

Add to `package.json`:

```json
"scripts": {
  "test": "vitest",
  "test:e2e": "playwright test"
}
```

---  

## 16. CI / CD  

### 16.1 GitHub Actions (`.github/workflows/build-and-deploy.yml`)  

```yaml
name: Build & Deploy

on:
  push:
    branches: [main]
  pull_request:
    types: [opened, synchronize, reopened]
  repository_dispatch:           # for CMS webhooks (Contentful)
    types: [contentful-deploy]

jobs:
  build:
    runs-on: ubuntu-latest
    env:
      PUBLIC_SITE_URL: ${{ secrets.SITE_URL }}
      PUBLIC_CONTENTFUL_SPACE_ID: ${{ secrets.CONTENTFUL_SPACE_ID }}
      CONTENTFUL_ACCESS_TOKEN: ${{ secrets.CONTENTFUL_ACCESS_TOKEN }}

    steps:
      - uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install deps
        run: npm ci

      - name: Run lint & tests
        run: |
          npm run lint
          npm test
          npm run test:e2e

      - name: Build Astro
        run: npm run build

      - name: Deploy to Vercel
        if: github.ref == 'refs/heads/main'
        uses: vercel/action@v2
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: .
          # Attach the built `dist` folder automatically
```

### 16.2 CMS webhook  

In Contentful → **Settings → Webhooks**  

* **URL**: `https://api.github.com/repos/<owner>/<repo>/dispatches`  
* **Method**: `POST`  
* **Headers**: `Authorization: token <PERSONAL_ACCESS_TOKEN>`  
* **Payload**: `{ "event_type": "contentful-deploy" }`  

GitHub Action `repository_dispatch` receives the `contentful-deploy` event and triggers a fresh build.

---  

## 17. Deployment Options  

| Provider | Pros | Cons |
|----------|------|------|
| **Vercel** | Zero‑config for Astro, automatic preview URLs, built‑in Edge Functions. | Edge functions limited to 1 MB bundle (not an issue here). |
| **Netlify** | Simple redirects, Netlify CMS integration, global CDN. | Slightly slower cold builds for large sites. |
| **Cloudflare Pages** | Fast Edge, Workers for custom logic. | No built‑in image optimization (need third‑party). |
| **Self‑host (Docker)** | Full control, useful for internal intranets. | More ops overhead. |

> **Recommendation**: **Vercel** – friendly to Astro, supports serverless functions for webhook handling, and provides preview builds for PRs.

---  

## 18. Optional Enhancements  

| Feature | Implementation Sketch |
|---------|------------------------|
| **Internationalization (i18n)** | Use `astro-i18n` or create locale‑specific markdown collections; Contentful locales sync automatically. |
| **Full‑text Search** | Generate a static `search-index.json` via `MiniSearch` during build (`src/lib/search/generate-index.ts`). Load it client‑side in a `SearchBox` island. |
| **Newsletter / Email Capture** | Add a `NewsletterForm` island calling Mailchimp API; store emails in a Airtable sheet or ConvertKit. |
| **Analytics** | Insert `<script async src="https://plausible.io/js/plausible.js"...>` in `BaseLayout`. |
| **RSS Feed** | Use `astro-plugin-feed` or custom script that iterates over posts and writes `rss.xml`. |
| **Sitemap** | `astro-plugin-sitemap`. |
| **Social Sharing Buttons** | Simple `<a>` links with `target="_blank"`; optionally a `ShareIsland` component using the Web Share API. |
| **Author Pages** | Dynamic `[author].astro` pulling author data and their posts. |
| **Tag Pages** | `/tag/[tag].astro` – list posts filtered by tag. |
| **Comment Moderation Dashboard** | Use GitHub Discussions (Giscus) - moderation done in GitHub. |
| **Error Monitoring** | Add Sentry (client‑only) via a small script. |

---  

## 19. Maintenance & Ops  

| Routine | Frequency | Action |
|---------|-----------|--------|
| **Dependency updates** | Monthly (or via Dependabot) | Run `npm audit`, update packages, test. |
| **Content backup** | Weekly | Export Contentful JSON dump (`contentful space export`). |
| **Performance audit** | Quarterly | Run Lighthouse CI (`npm run lighthouse`). |
| **SEO check** | Quarterly | Verify meta tags, structured data with Google Search Console. |
| **Accessibility review** | Quarterly | Run axe-core via Playwright CI. |
| **Content editorial workflow** | Ongoing | Use CMS roles (Editor, Admin); enable draft → preview mode (`astro preview`). |
| **Disaster recovery** | As needed | Keep a snapshot of the `dist/` folder on a CDN bucket. |

---  

## 20. Project Timeline (Sample)  

| Week | Milestones |
|------|------------|
| **1** | Set up repo, CI, Vercel project; scaffold Astro with Tailwind. |
| **2** | Choose and configure CMS (Contentful); define content model; create first content. |
| **3** | Build content fetch layer (`src/lib/cms/*`) + TypeScript types. |
| **4** | Implement core pages (Home, Blog archive, Post). |
| **5** | Add SEO component, Open Graph, RSS, Sitemap. |
| **6** | Implement islands: Comments (Giscus) & Theme toggle. |
| **7** | Add image optimization, responsive images, lazy loading. |
| **8** | Write unit / e2e tests; integrate Storybook. |
| **9** | Set up CMS webhooks → GitHub Actions → automatic rebuild. |
| **10**| Performance audit, lighthouse >90; final bug‑fixes. |
| **11**| Documentation, hand‑off to content editors; launch! |
| **12+**| Ongoing enhancements (search, i18n, newsletter). |

---  

## 21. Quick‑Start Commands  

```bash
# 1. Clone starter repo (or create empty) 
git clone https://github.com/your-org/astro-blog-cms.git
cd astro-blog-cms

# 2. Install deps
npm ci

# 3. Copy env template and fill values
cp .env.example .env
#   - PUBLIC_SITE_URL
#   - PUBLIC_CONTENTFUL_SPACE_ID
#   - CONTENTFUL_ACCESS_TOKEN
#   - (optional) VERCEL_TOKEN, etc.

# 4. Run dev server
npm run dev

# 5. Build for production
npm run build

# 6. Preview build locally
npm run preview
```

---  

## 22. Resources  

| Topic | Links |
|-------|-------|
| Astro Docs | <https://docs.astro.build> |
| Contentful API | <https://www.contentful.com/developers/docs/> |
| Sanity GROQ | <https://www.sanity.io/docs/groq> |
| TailwindCSS | <https://tailwindcss.com/docs> |
| Giscus (comments) | <https://giscus.app> |
| MiniSearch | <https://github.com/lucaong/minisearch> |
| Vercel Astro Deploy | <https://vercel.com/docs/concepts/deployments/astro> |
| SEO best practices | <https://developers.google.com/search/docs/advanced/structured-data> |
| Lighthouse CI | <https://github.com/GoogleChrome/lighthouse-ci> |
| Astro Image Tools | <https://docs.astro.build/en/guides/images/> |
| Astro Island Architecture | <https://astro.build/blog/introducing-astro-islands> |

---  

## 23. Closing Note  

This blueprint gives you a **complete, production‑ready roadmap** for a professional Astro blog with a headless CMS.  
All pieces are modular, so you can swap out the CMS, add new islands, or migrate to a different CDN without rewriting core business logic.  

Happy building! 🚀  
