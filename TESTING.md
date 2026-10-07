# Integration Testing Guide

## Prerequisites

1. **Graphood Platform Running:**
   ```bash
   cd Graphood
   npm run dev
   # Should run on http://localhost:3000
   ```

2. **Puck Test System Running:**
   ```bash
   cd puck-test-system
   npm run dev
   # Should run on http://localhost:3001 (or different port)
   ```

## Step-by-Step Testing

### 1. Register Pages with Graphood

```bash
cd puck-test-system
npm run register:pages
```

**Expected Output:**
```
✅ Pages registered successfully!
📊 Response: {
  "success": true,
  "message": "Pages structure updated successfully",
  "pages": [...]
}
```

**What this does:**
- Sends pages structure to Graphood Developer API
- Stores in `systems.pages_structure` column
- Defines which pages will be created when tenants subscribe

### 2. Verify Pages in Database

Connect to Graphood's database and run:
```sql
SELECT id, name, pages_structure 
FROM systems 
WHERE id = 'YOUR_SYSTEM_ID';
```

Should see 2 pages: `/` and `/products`

### 3. Provision a Test Tenant

In Graphood, create or use an existing tenant that subscribes to your system.

When provisioning happens:
- Pages are copied from `systems.pages_structure` to `tenant_site_pages`
- Each page gets `draft_content` and `published_content` columns
- Default content is set from pages config

### 4. Edit Content in Graphood

Navigate to:
```
http://localhost:3000/en/YOUR_TENANT_SLUG/edit
```

**What to check:**
- [ ] Page navigation sidebar shows "/" and "/products"
- [ ] Puck editor loads with components: Hero, TextSection, FeatureGrid
- [ ] Can edit component props (title, description, etc.)
- [ ] "Save Draft" button works
- [ ] "Publish" button works

### 5. View Published Content in External System

Navigate to:
```
http://localhost:3001/?tenantSlug=YOUR_TENANT_SLUG
```

**What to check:**
- [ ] Published content loads from Graphood
- [ ] Components render correctly (Hero, TextSection, FeatureGrid)
- [ ] Styling matches design

Navigate to products page:
```
http://localhost:3001/products?tenantSlug=YOUR_TENANT_SLUG
```

**What to check:**
- [ ] Products page loads
- [ ] Different content from home page
- [ ] All components render

### 6. Test API Endpoints

#### Get Published Site (Public API)
```bash
curl http://localhost:3000/api/tenants/YOUR_TENANT_SLUG/site?path=/
```

**Expected Response:**
```json
{
  "tenant": "YOUR_TENANT_SLUG",
  "data": {
    "content": [...],
    "root": {...}
  },
  "publishedAt": "2024-01-01T00:00:00.000Z"
}
```

#### Get System Pages (Developer API)
```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
  http://localhost:3000/api/developer/v1/systems/pages
```

**Expected Response:**
```json
{
  "pages": [
    {
      "path": "/",
      "title": "Home",
      "defaultContent": {...}
    },
    {
      "path": "/products",
      "title": "Products",
      "defaultContent": {...}
    }
  ]
}
```

## Common Issues & Solutions

### Issue: "Tenant slug is required"
**Solution:** Add `?tenantSlug=YOUR_TENANT` to URL

### Issue: "No published content found"
**Solution:** 
1. Open Graphood editor
2. Make a small change
3. Click "Publish"
4. Refresh external system

### Issue: Components not rendering
**Solution:**
1. Check browser console for errors
2. Verify component types match between systems
3. Check `sharedConfig` includes all components

### Issue: Pages not showing in editor
**Solution:**
1. Re-run `npm run register:pages`
2. Provision tenant again (or migrate existing)
3. Check `tenant_site_pages` table

### Issue: API returning 404
**Solution:**
1. Verify tenant exists and is ACTIVE
2. Check path format (must start with `/`)
3. Ensure content is published (not just draft)

## Integration Checklist

Before deploying to production:

- [ ] Pages structure registered successfully
- [ ] Test tenant provisioning creates all pages
- [ ] Editor loads and saves drafts correctly
- [ ] Publish workflow works
- [ ] External system renders published content
- [ ] Both pages (Home & Products) work
- [ ] Component props editable
- [ ] API endpoints return correct data
- [ ] Error states handled gracefully
- [ ] TypeScript compiles without errors

## Next Steps

1. **Deploy External System to Vercel:**
   - Update `NEXT_PUBLIC_GRAPHOOD_BASE_URL` to production
   - Get deployment URL

2. **Register System in Graphood:**
   - Set `target_url` to Vercel deployment
   - Test proxy through `/tenants/{slug}`

3. **Add More Pages:**
   - Edit `pages-config.ts`
   - Run `npm run register:pages`
   - Provision new tenants

4. **Extend Components:**
   - Add new components to `/lib/components/`
   - Export from `index.ts`
   - Add to `sharedConfig`
   - Update pages default content
