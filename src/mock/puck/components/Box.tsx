import { useState, useRef, useEffect } from "react";
import { BoxProps, FreeZoneProps } from "../types/puck.types";
import { ComponentConfig } from "@measured/puck";

const ResizableBox = ({
    title,
    description,
    align,
    borderRadius,
    bgColor,
    colSpan: initialColSpan = 1,
    rowSpan: initialRowSpan = 1,
}: BoxProps) => {
    const [colSpan, setColSpan] = useState(initialColSpan);
    const [rowSpan, setRowSpan] = useState(initialRowSpan);
    const [isResizing, setIsResizing] = useState(false);

    const boxRef = useRef<HTMLDivElement>(null);
    const startPos = useRef<{ x: number; y: number; col: number; row: number }>({
        x: 0,
        y: 0,
        col: 1,
        row: 1,
    });

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsResizing(true);

        startPos.current = {
            x: e.clientX,
            y: e.clientY,
            col: colSpan,
            row: rowSpan,
        };
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isResizing || !boxRef.current) return;

            const deltaX = e.clientX - startPos.current.x;
            const deltaY = e.clientY - startPos.current.y;

            const cellWidth = 250;
            const cellHeight = 180;

            const newCols = Math.min(
                4,
                Math.max(1, startPos.current.col + Math.round(deltaX / cellWidth))
            );
            const newRows = Math.min(
                4,
                Math.max(1, startPos.current.row + Math.round(deltaY / cellHeight))
            );

            setColSpan(newCols);
            setRowSpan(newRows);
        };

        const handleMouseUp = () => {
            if (isResizing) {
                setIsResizing(false);
            }
        };

        if (isResizing) {
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", handleMouseUp);
        }

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isResizing]);

    return (
        <div
            ref={boxRef}
            style={{
                borderRadius: borderRadius,
                backgroundColor: bgColor,
                gridColumn: `span ${colSpan}`,
                gridRow: `span ${rowSpan}`,
            }}
            className={`group relative w-full h-full border border-slate-200/80 p-6 shadow-sm hover:shadow-xl transition-all duration-300 ease-out select-none ${isResizing ? "ring-2 ring-indigo-500 shadow-2xl z-20" : ""
                }`}
        >
            <div
                className={`flex flex-col h-full justify-between gap-3 ${align === "inherit" ? "items-inherit text-inherit" : align
                    }`}
            >
                <div className="flex flex-col gap-3">
                    <div className="w-10 h-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 mb-1" />
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight leading-snug">
                        {title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed font-normal">
                        {description}
                    </p>
                </div>

                <div className="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity font-mono">
                    {colSpan}x{rowSpan} Grid Span
                </div>
            </div>

            <div
                onMouseDown={handleMouseDown}
                className="absolute bottom-1.5 right-1.5 w-5 h-5 cursor-se-resize flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-indigo-50 hover:bg-indigo-100 rounded-md border border-indigo-200"
                title="اسحب لتكبير/تصغير البوكس"
            >
                <svg
                    className="w-3 h-3 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M19 9l-10 10M19 15l-4 4"
                    />
                </svg>
            </div>
        </div>
    );
};

export const Box: ComponentConfig<BoxProps> = {
    fields: {
        title: { type: "text" },
        description: { type: "textarea" },
        align: {
            type: "select",
            options: [
                { label: "تتبع الجريد (Default)", value: "inherit" },
                { label: "يمين (Right)", value: "items-start text-right" },
                { label: "وسط (Center)", value: "items-center text-center" },
                { label: "يسار (Left)", value: "items-end text-left" },
            ],
        },
        borderRadius: {
            type: "select",
            options: [
                { label: "تتبع الجريد (Default)", value: "var(--grid-box-radius, 1.25rem)" },
                { label: "بدون انحناء (None)", value: "0px" },
                { label: "صغير (Rounded Sm)", value: "0.375rem" },
                { label: "متوسط (Rounded Md)", value: "0.75rem" },
                { label: "كبير (Rounded 2Xl)", value: "1.25rem" },
                { label: "دائري (Rounded 3Xl)", value: "2rem" },
            ],
        },
        bgColor: {
            type: "select",
            options: [
                { label: "تتبع الجريد (Default)", value: "var(--grid-box-bg, #ffffff)" },
                { label: "أبيض (White)", value: "#ffffff" },
                { label: "رمادي فاتح (Slate 50)", value: "#f8fafc" },
                { label: "بنفسجي خفيف (Indigo 50)", value: "#eef2ff" },
            ],
        },
    },
    defaultProps: {
        title: "عنوان البطاقة",
        description: "هذا النص مثال لوصف البطاقة، يمكنك تعديله من لوحة التحكم بسهولة.",
        align: "inherit",
        borderRadius: "var(--grid-box-radius, 1.25rem)",
        bgColor: "var(--grid-box-bg, #ffffff)",
        colSpan: 1,
        rowSpan: 1,
    },
    render: (props) => <ResizableBox {...props} />,
};