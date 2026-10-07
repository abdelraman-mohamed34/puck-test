import type { ComponentConfig } from "@measured/puck";
import { Product, GridProps } from "../types/puck.types";

const mockProducts: Product[] = [
    { id: "1", title: "حذاء رياضي مريح", price: "150 EGP" },
    { id: "2", title: "ساعة يد كلاسيكية", price: "450 EGP" },
    { id: "3", title: "حقيبة ظهر مقاومة للماء", price: "300 EGP" },
    { id: "4", title: "سماعات لاسلكية", price: "250 EGP" },
];

export const Grid: ComponentConfig<GridProps> = {
    fields: {
        columns: {
            type: "select",
            label: "عدد الأعمدة في الصف",
            options: [
                { label: "عمودان (2 Columns)", value: "grid-cols-1 md:grid-cols-2" },
                { label: "3 أعمدة (3 Columns)", value: "grid-cols-1 md:grid-cols-3" },
                { label: "4 أعمدة (4 Columns)", value: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4" },
            ],
        },
        gap: {
            type: "select",
            label: "المسافة بين الكروت (Gap)",
            options: [
                { label: "صغير (Gap 4)", value: "gap-4" },
                { label: "متوسط (Gap 6)", value: "gap-6" },
                { label: "كبير (Gap 8)", value: "gap-8" },
            ],
        },
        px: {
            type: "select",
            label: "الهامش الداخلي الأفقي للشبكة (Padding X)",
            options: [
                { label: "بدون (px-0)", value: "px-0" },
                { label: "صغير (px-4)", value: "px-4" },
                { label: "متوسط (px-6)", value: "px-6" },
                { label: "كبير (px-12)", value: "px-12" },
            ],
        },
        py: {
            type: "select",
            label: "الهامش الداخلي الرأسي للشبكة (Padding Y)",
            options: [
                { label: "بدون (py-0)", value: "py-0" },
                { label: "صغير (py-4)", value: "py-4" },
                { label: "متوسط (py-6)", value: "py-6" },
                { label: "كبير (py-12)", value: "py-12" },
            ],
        },
        cardRadius: {
            type: "select",
            label: "انحناء حواف كروت المنتجات",
            options: [
                { label: "بدون انحناء (0px)", value: "0px" },
                { label: "صغير (0.5rem)", value: "0.5rem" },
                { label: "متوسط (1rem)", value: "1rem" },
                { label: "كبير ناعم (1.5rem)", value: "1.5rem" },
            ],
        },
        cardBgColor: {
            type: "select",
            label: "خلفية كروت المنتجات",
            options: [
                { label: "أبيض (White)", value: "#ffffff" },
                { label: "رمادي فاتح (Slate 50)", value: "#f8fafc" },
                { label: "بنفسجي خفيف (Indigo 50)", value: "#eef2ff" },
                { label: "داكن (Dark Slate)", value: "#1e293b" },
            ],
        },
        showBorder: {
            type: "radio",
            label: "إظهار إطار للكروت (Border)",
            options: [
                { label: "نعم", value: true },
                { label: "لا", value: false },
            ],
        },
        align: {
            type: "select",
            label: "محاذاة النصوص داخل الكارت",
            options: [
                { label: "يمين (Right)", value: "text-right" },
                { label: "وسط (Center)", value: "text-center" },
                { label: "يسار (Left)", value: "text-left" },
            ],
        },
    },

    defaultProps: {
        columns: "grid-cols-1 md:grid-cols-4",
        gap: "gap-6",
        px: "px-6",
        py: "py-6",
        cardRadius: "1rem",
        cardBgColor: "#ffffff",
        showBorder: true,
        align: "text-right",
    },

    render: ({ columns, gap, px, py, cardRadius, cardBgColor, showBorder, align }) => {
        return (
            <div className={`w-full ${px} ${py}`}>
                <div className={`grid ${columns} ${gap}`}>
                    {mockProducts.map((product) => (
                        <div
                            key={product.id}
                            style={{
                                borderRadius: cardRadius,
                                backgroundColor: cardBgColor,
                            }}
                            className={`p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-200 ${align} ${showBorder ? "border border-slate-200/80" : ""
                                }`}
                        >
                            {/* صورة مؤقتة للمنتج */}
                            <div className="w-full h-40 bg-slate-100 rounded-lg mb-4 flex items-center justify-center text-slate-400 text-sm">
                                صورة المنتج
                            </div>

                            <div>
                                <h4 className="font-semibold text-slate-900 text-lg mb-1">
                                    {product.title}
                                </h4>
                                <p className="text-indigo-600 font-bold text-md mb-4">
                                    {product.price}
                                </p>
                            </div>

                            <button className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors">
                                إضافة للحقيبة
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        );
    },
};