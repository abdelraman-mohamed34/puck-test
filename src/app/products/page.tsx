"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Render } from "@measured/puck";
import { sharedConfig } from "@/lib/site-contract";
import { getPublishedTenantSite } from "@/app/shared/lib/graphood/client";
import type { Data } from "@measured/puck";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const tenantSlug = searchParams.get("tenantSlug");
  const [publishedContent, setPublishedContent] = useState<Data | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadContent() {
      if (!tenantSlug) {
        setError("Tenant slug is required. Add ?tenantSlug=YOUR_TENANT to the URL");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const result = await getPublishedTenantSite(tenantSlug, "/products");

        if (result?.data) {
          setPublishedContent(result.data as Data);
          setError(null);
        } else {
          setError("No published content found for this page");
        }
      } catch (err) {
        console.error("Failed to load published content:", err);
        setError(err instanceof Error ? err.message : "Failed to load content");
      } finally {
        setIsLoading(false);
      }
    }

    loadContent();
  }, [tenantSlug]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
          <div className="animate-spin w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto" />
          <p className="text-slate-600">Loading products page...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="max-w-md mx-auto p-8 bg-white rounded-2xl shadow-lg border border-slate-200">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-slate-900">Products Page Not Found</h2>
            <p className="text-slate-600">{error}</p>
            <div className="pt-4">
              <a
                href={`/?tenantSlug=${tenantSlug}`}
                className="inline-block px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
              >
                Go to Home
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!publishedContent) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
          <p className="text-slate-600">No content available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Render config={sharedConfig} data={publishedContent} />
    </div>
  );
}
