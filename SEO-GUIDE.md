# 🩺 Dr. Janvi Rana – Complete SEO Guide

> **Purpose:** This guide documents all SEO changes made to `index.html`, explains why each change matters, and provides a clear checklist for anyone to verify or update the SEO settings in the future.

---

## 📁 File to Edit

```
DrJanviRana/index.html
```

---

## ✅ MASTER CHECKLIST — All SEO Changes

| # | Task | Location in File | Status |
|---|------|-----------------|--------|
| 1 | Add `<meta keywords>` | `<head>` section | ✅ Done |
| 2 | Add `<meta author>` | `<head>` section | ✅ Done |
| 3 | Add `<meta publisher>` | `<head>` section | ✅ Done |
| 4 | Add `<meta robots>` | `<head>` section | ✅ Done |
| 5 | Add `<link canonical>` | `<head>` section | ⚠️ Update domain after deploy |
| 6 | Add Open Graph tags | `<head>` section | ⚠️ Update domain after deploy |
| 7 | Add Twitter Card tags | `<head>` section | ⚠️ Update domain after deploy |
| 8 | Add Schema.org JSON-LD | `<head>` section | ⚠️ Update domain after deploy |
| 9 | Add `title` to all images | `<body>` section | ✅ Done |

---

## 📝 SECTION 1 — Meta Tags

### Where to paste: Inside `<head>`, after the `<meta description>` tag

```html
<meta name="keywords" content="Physiotherapist Surat, Physiotherapy Home Visits, Dr. Janvi Rana, BPT, Civil Hospital, Adajan, Pal, Jahangirpura, Palanpur, Vesu, Piplod, Umra, Athwa, Orthopedic Rehab, Neuro Rehab, Chest Physiotherapy">
<meta name="author" content="Dr. Janvi Rana">
<meta name="publisher" content="Dr. Janvi Rana">
<meta name="robots" content="index, follow">
<link rel="canonical" href="https://YOUR-LIVE-DOMAIN.com/">
```

> ⚠️ **ACTION REQUIRED:** Replace `https://YOUR-LIVE-DOMAIN.com/` with your real deployed website URL.
> Example: If deployed on Vercel → `https://drjanvirana.vercel.app/`

### Why each tag matters:

| Tag | Why It Matters |
|-----|---------------|
| `keywords` | Used by Bing and AI crawlers (not Google, but still valuable) |
| `author` | Signals who created the content — builds E-E-A-T trust with Google |
| `publisher` | Reinforces brand identity |
| `robots` | `index, follow` tells Google: "Please crawl and rank this page" |
| `canonical` | Prevents duplicate content penalty by telling Google the "main" URL |

---

## 📝 SECTION 2 — Open Graph Tags (Facebook, LinkedIn, WhatsApp)

### Where to paste: After the canonical tag

```html
<!-- Open Graph (Facebook / LinkedIn / WhatsApp Share Preview) -->
<meta property="og:title" content="Dr. Janvi Rana (PT) | Physiotherapist Surat – Physiotherapy Home Visits">
<meta property="og:description" content="Personalized 1-on-1 physiotherapy by Dr. Janvi Rana, BPT (Govt. Physiotherapy College (Civil), Surat • VNSGU). Evidence-based home visits across Adajan, Pal, Jahangirpura, Palanpur, Vesu, Piplod, Umra, Athwa.">
<meta property="og:image" content="https://YOUR-LIVE-DOMAIN.com/assets/images/dr-janvi-portrait.png">
<meta property="og:url" content="https://YOUR-LIVE-DOMAIN.com/">
<meta property="og:type" content="website">
```

> ⚠️ **ACTION REQUIRED:** Replace both `https://YOUR-LIVE-DOMAIN.com/` with your real deployed URL.

### Why Open Graph matters:
When someone shares your website link on **WhatsApp, Facebook, or LinkedIn**, these tags control the **preview card** that appears — the image, title, and description shown. Without these, the preview looks blank or broken.

---

## 📝 SECTION 3 — Twitter Card Tags

### Where to paste: After Open Graph tags

```html
<!-- Twitter Cards -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Dr. Janvi Rana (PT) | Physiotherapist Surat – Physiotherapy Home Visits">
<meta name="twitter:description" content="Personalized 1-on-1 physiotherapy by Dr. Janvi Rana, BPT (Govt. Physiotherapy College (Civil), Surat • VNSGU). Evidence-based home visits across Adajan, Pal, Jahangirpura, Palanpur, Vesu, Piplod, Umra, Athwa.">
<meta name="twitter:image" content="https://YOUR-LIVE-DOMAIN.com/assets/images/dr-janvi-portrait.png">
```

> ⚠️ **ACTION REQUIRED:** Replace `https://YOUR-LIVE-DOMAIN.com/` with your real deployed URL.

### Why Twitter Cards matter:
Controls how your link appears when shared on **Twitter/X**. `summary_large_image` shows a large image preview which gets significantly more clicks.

---

## 📝 SECTION 4 — Schema.org Structured Data (JSON-LD)

This is the **most powerful SEO addition** — it tells Google and AI tools (like ChatGPT, Gemini, Perplexity) explicitly that this is a **Doctor / Physician** operating in **Surat**.

### Where to paste: After Twitter Card tags

```html
<!-- Schema.org JSON-LD — Structured Data for Google & AI Tools -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Physician",
  "name": "Dr. Janvi Rana (PT)",
  "description": "Personalized 1-on-1 physiotherapy by Dr. Janvi Rana, BPT (Govt. Physiotherapy College (Civil), Surat • VNSGU). Evidence-based home visits across Adajan, Pal, Jahangirpura, Palanpur, Vesu, Piplod, Umra, Athwa.",
  "image": "https://YOUR-LIVE-DOMAIN.com/assets/images/dr-janvi-portrait.png",
  "url": "https://YOUR-LIVE-DOMAIN.com/",
  "telephone": "+91 96626 98781",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Surat",
    "addressRegion": "Gujarat",
    "addressCountry": "IN"
  }
}
</script>
```

> ⚠️ **ACTION REQUIRED:** Replace both `https://YOUR-LIVE-DOMAIN.com/` with your real deployed URL.

### Why Schema.org matters:
- Google uses this to show **rich results** (Knowledge Panels, contact info directly in search)
- AI tools like **ChatGPT and Perplexity** use structured data to reference your website when answering questions about physiotherapy in Surat
- Increases chances of appearing in **"People also ask"** and **featured snippets**

### 💡 Optional Future Upgrade — Add these fields for even more power:

```json
"medicalSpecialty": "Physiotherapy",
"priceRange": "₹₹",
"availableService": [
  "Post-Operative Orthopedic Rehabilitation",
  "Spine & Sciatica Treatment",
  "Neurological & Stroke Rehabilitation",
  "Frozen Shoulder & Joint Mobilization",
  "Chest Physiotherapy"
],
"sameAs": [
  "https://www.practo.com/YOUR-PROFILE",
  "https://www.justdial.com/YOUR-LISTING",
  "https://www.linkedin.com/in/YOUR-PROFILE"
]
```

---

## 📝 SECTION 5 — Image Title Attributes

All 4 images must have both `alt` AND `title` attributes. Here is the correct code for each:

### Image 1 — Doctor Portrait (inside the modal drawer)
```html
<img src="assets/images/dr-janvi-portrait.png"
  alt="Dr. Janvi Rana (PT)"
  title="Dr. Janvi Rana (PT)"
  style="width: 68px; ...">
```

### Image 2 — Doctor Portrait (in the About section)
```html
<img src="assets/images/dr-janvi-portrait.png"
  alt="Dr. Janvi Rana (PT) – Spine & Physiotherapy Specialist Surat"
  title="Dr. Janvi Rana (PT) – Spine & Physiotherapy Specialist Surat">
```

### Image 3 — Spine Rehab Scene
```html
<img class="scroll-expand__media"
  src="assets/images/spine-rehab-scene.png"
  alt="Dr. Janvi Rana Precision Spine & Rehabilitation Surat"
  title="Dr. Janvi Rana Precision Spine & Rehabilitation Surat"
  draggable="false" />
```

### Image 4 — Home Visit Care
```html
<img src="assets/images/home-visit-care.png"
  alt="Dr. Janvi Rana In-Home Physiotherapy Care Surat"
  title="Dr. Janvi Rana In-Home Physiotherapy Care Surat"
  loading="lazy">
```

### Why `title` on images matters:
| Attribute | Purpose |
|-----------|---------|
| `alt` | Shown when image fails to load. Used by screen readers. Required for accessibility. |
| `title` | Shown as tooltip on hover. Used by Google Image Search for ranking. |

---

## 🔑 SECTION 6 — Content Quality Review

The existing website content is **strong and highly SEO-friendly**:

| Factor | Status | Detail |
|--------|--------|--------|
| Location keywords | ✅ Excellent | Adajan, Pal, Vesu, Surat repeat naturally in content |
| Clinical keywords | ✅ Excellent | Orthopedic, Sciatica, Neurological, ICU used in headings |
| Heading structure | ✅ Correct | H1 → H2 → H3 → H4 in proper hierarchy |
| Contact info visible | ✅ Good | WhatsApp, phone, email present — great for local SEO signals |
| Patient testimonials | ✅ Good | Include location (Adajan, Vesu) — adds local trust signals |
| Meta description length | ⚠️ Slightly long | 208 chars (ideal is 150–160). Google may auto-trim but content quality is fine. |

---

## 🌐 SECTION 7 — After Deployment Action Plan

Once the website is live on a real domain, complete these steps **in order**:

### Step 1 — Update all domain URLs in `index.html`
Search for `https://YOUR-LIVE-DOMAIN.com/` and replace every occurrence with your actual URL. It appears in these 7 places:
1. `<link rel="canonical" href="...">`
2. `<meta property="og:image" content="...">`
3. `<meta property="og:url" content="...">`
4. `<meta name="twitter:image" content="...">`
5. JSON-LD `"image": "..."`
6. JSON-LD `"url": "..."`

---

### Step 2 — Create `robots.txt`
Create a new file called `robots.txt` in the root project folder with this exact content:

```
User-agent: *
Allow: /
Sitemap: https://YOUR-LIVE-DOMAIN.com/sitemap.xml
```

> Replace `YOUR-LIVE-DOMAIN.com` with your real domain.

---

### Step 3 — Create `sitemap.xml`
Create a new file called `sitemap.xml` in the root project folder with this exact content:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://YOUR-LIVE-DOMAIN.com/</loc>
    <lastmod>2026-09-25</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

> Replace `YOUR-LIVE-DOMAIN.com` with your real domain.

---

### Step 4 — Submit to Google Search Console
1. Go to → [search.google.com/search-console](https://search.google.com/search-console)
2. Click **"Add Property"** and enter your website URL
3. Verify ownership (easiest: download the HTML file Google gives you and put it in the root folder)
4. Go to **Sitemaps** section and submit: `https://YOUR-LIVE-DOMAIN.com/sitemap.xml`
5. Wait 2–7 days for Google to crawl and index the site

---

### Step 5 — Create a Google Business Profile
1. Go to → [business.google.com](https://business.google.com)
2. Add **Dr. Janvi Rana** as a **Physiotherapist** in Surat
3. Enter the **exact same phone number and address** as on this website
4. Add website link → your live URL
5. **Ask every satisfied patient to leave a 5-star Google review**

> 🌟 Google Reviews are the **#1 local ranking factor**. Even 5–10 good reviews can push the website to the top of local search results.

---

### Step 6 — Register on Healthcare Directories
These create **backlinks** that signal authority to Google:

| Platform | URL | Action |
|----------|-----|--------|
| Practo | [practo.com](https://www.practo.com) | Create doctor profile, add website link |
| JustDial | [justdial.com](https://www.justdial.com) | Add business listing |
| Sulekha | [sulekha.com](https://www.sulekha.com) | Add physiotherapist listing |
| LinkedIn | [linkedin.com](https://www.linkedin.com) | Create professional profile, add website |

---

## 🧪 SECTION 8 — How to Test Your SEO

Run these tests once the website is live:

| Test Tool | URL | What It Checks |
|-----------|-----|---------------|
| Google Rich Results Test | [search.google.com/test/rich-results](https://search.google.com/test/rich-results) | Schema.org JSON-LD validity |
| Facebook Sharing Debugger | [developers.facebook.com/tools/debug](https://developers.facebook.com/tools/debug) | Open Graph preview |
| Google PageSpeed Insights | [pagespeed.web.dev](https://pagespeed.web.dev) | Speed & mobile score |
| Google Mobile-Friendly Test | [search.google.com/test/mobile-friendly](https://search.google.com/test/mobile-friendly) | Mobile responsiveness |
| SEO META in 1 Click | Chrome Extension | All meta tags at once (same tool as used for analysis) |

---

## 📌 Quick Reference — Where All SEO Tags Go in `index.html`

```
<head>
  <meta charset="UTF-8">
  <meta name="viewport" ...>
  <title>...</title>
  <meta name="description" ...>

  ↓ ---- ALL SEO TAGS GO HERE ---- ↓

  <meta name="keywords" ...>            ← Section 1
  <meta name="author" ...>              ← Section 1
  <meta name="publisher" ...>           ← Section 1
  <meta name="robots" ...>              ← Section 1
  <link rel="canonical" ...>            ← Section 1

  <meta property="og:title" ...>        ← Section 2
  <meta property="og:description" ...>  ← Section 2
  <meta property="og:image" ...>        ← Section 2
  <meta property="og:url" ...>          ← Section 2
  <meta property="og:type" ...>         ← Section 2

  <meta name="twitter:card" ...>        ← Section 3
  <meta name="twitter:title" ...>       ← Section 3
  <meta name="twitter:description" ...> ← Section 3
  <meta name="twitter:image" ...>       ← Section 3

  <script type="application/ld+json">   ← Section 4
    { ... }
  </script>

  ↑ ---- END OF SEO TAGS ---- ↑

  <!-- Favicon and Theme Color -->
  <link rel="icon" ...>
  <meta name="theme-color" ...>
  ...fonts and stylesheets...
</head>
```

---

*Guide created: 25 September 2026*
*Website: Dr. Janvi Rana (PT) — Physiotherapist Surat*
*Contact: janvibrana1802@gmail.com | +91 96626 98781*
