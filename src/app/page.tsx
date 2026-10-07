import { Render } from "@measured/puck";
import { sharedConfig } from "@/lib/site-contract";
import { getPublishedTenantSite } from "@/app/shared/lib/graphood/server-client";
import { resolvePublishedContent } from "@/lib/published-content";

type HomePageProps = {
  searchParams: Promise<{ tenantSlug?: string }>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const tenantSlug = params.tenantSlug;

  if (!tenantSlug) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="max-w-md mx-auto p-8 bg-white rounded-2xl shadow-lg border border-slate-200">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-slate-900">Missing Tenant</h2>
            <p className="text-slate-600">Tenant slug is required. Add ?tenantSlug=YOUR_TENANT to the URL</p>
          </div>
        </div>
      </div>
    );
  }

  try {
    const result = await getPublishedTenantSite(tenantSlug, "/");
    const { content, error: contentError } = resolvePublishedContent(result);

    if (contentError) {
      return (
        <div className="flex h-screen w-full items-center justify-center bg-slate-50">
          <div className="max-w-md mx-auto p-8 bg-white rounded-2xl shadow-lg border border-slate-200">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-slate-900">Content Not Found</h2>
              <p className="text-slate-600">{contentError}</p>
              <div className="pt-4">
                <a
                  href="/"
                  className="inline-block px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
                >
                  Go Back
                </a>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (!content) {
      return (
        <div className="flex h-screen w-full items-center justify-center bg-slate-50">
          <div className="text-center space-y-4">
            <p className="text-slate-600">No content available</p>
          </div>
        </div>
      );
    }

    console.log(content);

    return (
      <div className="min-h-screen bg-white">
        <Render config={sharedConfig} data={content} />
      </div>
    );
  } catch (err) {
    console.error("Failed to load published content:", err);
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="max-w-md mx-auto p-8 bg-white rounded-2xl shadow-lg border border-slate-200">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-slate-900">Failed to Load Content</h2>
            <p className="text-slate-600">{err instanceof Error ? err.message : "Failed to load content"}</p>
            <div className="pt-4">
              <a
                href="/"
                className="inline-block px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
              >
                Go Back
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
