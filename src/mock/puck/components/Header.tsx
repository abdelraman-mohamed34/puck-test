import type { ComponentConfig } from "@measured/puck";
import { HeaderProps } from "../types/puck.types";

export const Header: ComponentConfig<HeaderProps> = {
    fields: {
        logoText: { type: "text", label: "اسم اللوجو / الموقع" },
        navLinks: {
            type: "textarea",
            label: "روابط القائمة (افصل بينها بفاصلة ,)",
        },
        ctaText: { type: "text", label: "نص الزر الرئيس (CTA)" },
        variant: {
            type: "select",
            label: "ستايل الهيدر",
            options: [
                { label: "أبيض ناعم (Clean White)", value: "bg-white/90 border-b border-slate-200/80 text-slate-800" },
                { label: "شفاف غامق (Dark Backdrop)", value: "bg-slate-900/90 border-b border-slate-800 text-white" },
                { label: "تدرج ملون (Gradient)", value: "bg-gradient-to-r from-indigo-900 via-slate-900 to-purple-950 text-white border-b border-indigo-500/20" },
            ],
        },
        sticky: {
            type: "radio",
            label: "تثبيت الهيدر أعلى الصفحة (Sticky)",
            options: [
                { label: "نعم", value: true },
                { label: "لا", value: false },
            ],
        },
    },
    defaultProps: {
        logoText: "شعارك",
        navLinks: "الرئيسية, الخدمات, من نحن, اتصل بنا",
        ctaText: "ابدأ الآن",
        variant: "bg-white/90 border-b border-slate-200/80 text-slate-800",
        sticky: true,
    },
    render: ({ logoText, navLinks, ctaText, variant, sticky }) => {
        const linksList = navLinks
            .split(",")
            .map((link) => link.trim())
            .filter(Boolean);

        return (
            <header
                className={`w-full backdrop-blur-md transition-all z-50 ${variant} ${sticky ? "sticky top-0" : "relative"
                    }`}
            >
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-black text-lg shadow-md shadow-indigo-500/20">
                            {logoText.charAt(0)}
                        </div>
                        <span className="text-xl font-bold tracking-tight">
                            {logoText}
                        </span>
                    </div>

                    <nav className="hidden md:flex items-center gap-8">
                        {linksList.map((link, idx) => (
                            <a
                                key={idx}
                                href="#"
                                className="text-sm font-medium opacity-80 hover:opacity-100 hover:text-indigo-500 transition-colors"
                            >
                                {link}
                            </a>
                        ))}
                    </nav>

                    <div className="flex items-center gap-4">
                        {ctaText && (
                            <button className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200">
                                {ctaText}
                            </button>
                        )}
                    </div>
                </div>
            </header>
        );
    },
};