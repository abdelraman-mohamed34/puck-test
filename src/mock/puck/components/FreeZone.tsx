import { DropZone, type ComponentConfig } from "@measured/puck";
import { FreeZoneProps } from "../types/puck.types";

export const FreeZone: ComponentConfig<FreeZoneProps> = {
    fields: {
        columns: {
            type: "select",
            label: "عدد الأعمدة في الصف",
            options: [
                { label: "عمود واحد (1 Column)", value: "grid-cols-1" },
                { label: "عمودان (2 Columns)", value: "grid-cols-1 md:grid-cols-2" },
                { label: "3 أعمدة (3 Columns)", value: "grid-cols-1 md:grid-cols-3" },
                { label: "4 أعمدة (4 Columns)", value: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4" },
            ],
        },
        gap: {
            type: "select",
            label: "المسافة بين العناصر (Gap)",
            options: [
                { label: "صغير جداً (Gap 2)", value: "gap-2" },
                { label: "صغير (Gap 4)", value: "gap-4" },
                { label: "متوسط (Gap 6)", value: "gap-6" },
                { label: "كبير (Gap 8)", value: "gap-8" },
                { label: "كبير جداً (Gap 12)", value: "gap-12" },
            ],
        },
        px: {
            type: "select",
            label: "الهامش الداخلي الأفقي (Padding X)",
            options: [
                { label: "بدون (px-0)", value: "px-0" },
                { label: "صغير (px-4)", value: "px-4" },
                { label: "متوسط (px-6)", value: "px-6" },
                { label: "كبير (px-12)", value: "px-12" },
            ],
        },
        py: {
            type: "select",
            label: "الهامش الداخلي الرأسي (Padding Y)",
            options: [
                { label: "بدون (py-0)", value: "py-0" },
                { label: "صغير (py-4)", value: "py-4" },
                { label: "متوسط (py-6)", value: "py-6" },
                { label: "كبير (py-12)", value: "py-12" },
            ],
        },
        globalRadius: {
            type: "select",
            label: "انحناء الحواف للكل",
            options: [
                { label: "حاد جداً (Rounded Small)", value: "0.375rem" },
                { label: "متوسط (Rounded Medium)", value: "0.75rem" },
                { label: "كبير ناعم (Rounded Large)", value: "1.25rem" },
                { label: "دائري جداً (Rounded Full)", value: "2rem" },
            ],
        },
        globalBgColor: {
            type: "select",
            label: "خلفية البوكسات الموحدة",
            options: [
                { label: "افتراضي (أبيض)", value: "#ffffff" },
                { label: "رمادي فاتح (Slate 50)", value: "#f8fafc" },
                { label: "بنفسجي خفيف (Indigo 50)", value: "#eef2ff" },
                { label: "شفاف (Transparent)", value: "transparent" },
            ],
        },
        globalAlign: {
            type: "select",
            label: "محاذاة المحتوى للكل",
            options: [
                { label: "يمين (Right)", value: "items-start text-right" },
                { label: "وسط (Center)", value: "items-center text-center" },
                { label: "يسار (Left)", value: "items-end text-left" },
            ],
        },
    },

    defaultProps: {
        columns: "grid-cols-1 md:grid-cols-3",
        gap: "gap-6",
        px: "px-6",
        py: "py-6",
        globalRadius: "1.25rem",
        globalBgColor: "#ffffff",
        globalAlign: "items-start text-right",
    },

    render: ({ columns, gap, px, py, globalRadius, globalBgColor, globalAlign }) => {
        return (
            <div
                style={
                    {
                        "--grid-box-radius": globalRadius,
                        "--grid-box-bg": globalBgColor,
                    } as React.CSSProperties
                }
            >
                <DropZone
                    zone="free-zone"
                    className={`grid ${columns} ${gap} ${px} ${py} ${globalAlign} auto-rows-[minmax(180px,auto)]`}
                />
            </div>
        );
    },
};