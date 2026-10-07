#!/usr/bin/env node
/**
 * Register Pages Structure with Graphood
 *
 * This script registers the system's pages structure with the Graphood platform
 * via the Developer API (/api/developer/v1/systems/pages)
 */

import { PAGES_STRUCTURE } from '../src/lib/pages-config.js';

const GRAPHOOD_API_URL = process.env.NEXT_PUBLIC_GRAPHOOD_BASE_URL || 'https://graphood.com';
const API_KEY = process.env.GRAPHOOD_SERVER_API_KEY;

if (!API_KEY) {
  console.error('❌ Error: GRAPHOOD_SERVER_API_KEY is not set in environment variables');
  process.exit(1);
}

async function registerPages() {
  console.log('🚀 Registering pages structure with Graphood...\n');
  console.log(`📍 API URL: ${GRAPHOOD_API_URL}`);
  console.log(`📄 Pages to register: ${PAGES_STRUCTURE.length}\n`);

  PAGES_STRUCTURE.forEach((page, index) => {
    console.log(`${index + 1}. ${page.title} (${page.path})`);
  });

  console.log('\n⏳ Sending request...\n');

  try {
    const response = await fetch(`${GRAPHOOD_API_URL}/api/developer/v1/system/pages`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        pages: PAGES_STRUCTURE.map(page => ({
          path: page.path,
          title: page.title,
          defaultContent: page.defaultContent
        }))
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Failed to register pages:');
      console.error(`   Status: ${response.status}`);
      console.error(`   Response:`, JSON.stringify(data, null, 2));
      process.exit(1);
    }

    console.log('✅ Pages registered successfully!\n');
    console.log('📊 Response:', JSON.stringify(data, null, 2));
    console.log('\n✨ Your system pages are now registered with Graphood.');
    console.log('💡 When a tenant subscribes to your system, these pages will be automatically provisioned.');

  } catch (error) {
    console.error('❌ Network error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

registerPages();
