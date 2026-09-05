import type { Config } from "@measured/puck";

export type TenantSiteProps = {
    Hero: {
        title: string;
        subtitle: string;
        ctaText: string;
        ctaLink: string;
    };
    FeatureGrid: {
        title: string;
        features: { heading: string; description: string }[];
    };
};

export const tenantSiteConfig: Config<TenantSiteProps> = {
    components: {
        Hero: {
            fields: {
                title: { type: "text" },
                subtitle: { type: "text" },
                ctaText: { type: "text" },
                ctaLink: { type: "text" },
            },
            defaultProps: {
                title: "مرحباً بك في متجرنا",
                subtitle: "نحن نقدم أفضل المنتجات والخدمات التي تلبي احتياجاتك بأعلى جودة.",
                ctaText: "تصفح المنتجات",
                ctaLink: "#products",
            },
            render: ({ title, subtitle, ctaText, ctaLink }) => (
                <div className="my-8 rounded-2xl border bg-slate-900 p-12 text-center text-white shadow-xl" dir="auto">
                    <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">{title}</h1>
                    <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">{subtitle}</p>
                    {ctaText && (
                        <div className="mt-8">
                            <a
                                href={ctaLink}
                                className="inline-block rounded-xl bg-blue-600 px-8 py-3 text-base font-semibold text-white shadow-md transition-all hover:bg-blue-500 hover:shadow-lg"
                            >
                                {ctaText}
                            </a>
                        </div>
                    )}
                </div>
            ),
        },
        FeatureGrid: {
            fields: {
                title: { type: "text" },
                features: {
                    type: "array",
                    getItemSummary: (item) => item.heading || "ميزة جديدة",
                    arrayFields: {
                        heading: { type: "text" },
                        description: { type: "text" },
                    },
                },
            },
            defaultProps: {
                title: "لماذا تختار متجرنا؟",
                features: [
                    { heading: "شحن سريع", description: "توصيل سريع وفعال لكافة المحافظات." },
                    { heading: "دفع آمن", description: "خيارات دفع متعددة وآمنة تماماً." },
                    { heading: "جودة مضمونة", description: "منتجات صممت واختيرت بعناية فائقة." },
                ],
            },
            render: ({ title, features }) => (
                <div className="my-12 py-6" dir="auto">
                    <h2 className="mb-8 text-center text-2xl font-bold text-slate-800">{title}</h2>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                        {features.map((feat, idx) => (
                            <div key={idx} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
                                <h3 className="mb-2 text-lg font-bold text-slate-900">{feat.heading}</h3>
                                <p className="text-sm text-slate-600">{feat.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ),
        },
    },
};