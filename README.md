# Puck Test System - Graphood Integration

## Overview

This is an external system that integrates with the Graphood platform. It provides a visual page editor using Puck for tenant customization.

## Features

- **Two Pages Structure:**
  - `/` - Home page with hero, features, and call-to-action
  - `/products` - Products page with category listings

- **Reusable Components:**
  - `Hero` - Full-width hero section with CTA
  - `TextSection` - Text content section with alignment options
  - `FeatureGrid` - Grid layout for features/services

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   Create `.env.local` with:
   ```env
   GRAPHOOD_SERVER_API_KEY=your_api_key_here
   NEXT_PUBLIC_GRAPHOOD_BASE_URL=https://graphood.com
   NEXT_PUBLIC_ROOT_DOMAIN=https://your-vercel-app.vercel.app/
   ```

3. **Register pages structure with Graphood:**
   ```bash
   npm run register:pages
   ```

   This will register the 2 pages (Home + Products) with Graphood's Developer API.

## Development

```bash
npm run dev
```

Visit `http://localhost:3000?tenantSlug=YOUR_TENANT_SLUG`

## How It Works

### 1. Pages Registration
- System developer defines pages in `src/lib/pages-config.ts`
- Run `npm run register:pages` to push structure to Graphood
- Graphood stores pages in `systems.pages_structure`

### 2. Tenant Provisioning
- When a tenant subscribes, Graphood copies pages from system to `tenant_site_pages`
- Each page gets draft + published content columns

### 3. Content Editing (in Graphood)
- Tenant goes to `/{tenant_slug}/edit` in Graphood
- Visual editor loads with Puck components
- Content saved as draft
- Publish button copies draft → published

### 4. Public Rendering (in External System)
- External system fetches published content via:
  `GET /api/tenants/{tenant_slug}/site?path=/`
- Renders using Puck's `<Render>` component
- Uses shared component contract

## API Integration

### Fetch Published Content
```typescript
import { getPublishedTenantSite } from "@/app/shared/lib/graphood/client";

const result = await getPublishedTenantSite("tenant-slug", "/");
// result.data contains Puck Data structure
```

### Component Contract
All components follow this structure:
```typescript
{
  type: "Hero" | "TextSection" | "FeatureGrid",
  id: "unique-id",
  props: { ... }
}
```

## File Structure

```
src/
├── lib/
│   ├── components/          # Puck components (Hero, TextSection, FeatureGrid)
│   ├── pages-config.ts      # Pages structure definition
│   └── site-contract.tsx    # Shared config & types
├── app/
│   ├── page.tsx             # Home page (/)
│   ├── products/page.tsx    # Products page (/products)
│   └── shared/lib/graphood/ # Graphood API client
└── mock/puck/               # Legacy mock components (for reference)
```

## Deployment

1. Deploy to Vercel (or your hosting platform)
2. Get the deployment URL
3. Register it in Graphood as system's `target_url`
4. Tenants will be proxied through Graphood's `/tenants/{slug}` route

## Troubleshooting

### "Tenant slug is required"
Add `?tenantSlug=YOUR_TENANT` to the URL.

### "No published content found"
1. Check if pages are registered: `npm run register:pages`
2. Verify tenant has published content in Graphood editor
3. Check API endpoint: `/api/tenants/{slug}/site?path=/`

### Components not rendering
1. Ensure component types match in both systems
2. Check `sharedConfig` in `site-contract.tsx`
3. Verify props structure matches component fields

## Next Steps

- Add more pages (about, contact, etc.)
- Extend component library
- Add page-level metadata (SEO, OG tags)
- Implement navigation menu from pages structure
