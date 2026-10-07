import type { ComponentConfig } from "@measured/puck";
import { HeadingBlockProps } from "../types/puck.types";

export const HeadingBlock: ComponentConfig<HeadingBlockProps> = {
    fields: {
        title: { type: "text" },
    },
    defaultProps: {
        title: "Heading",
    },
    render: ({ title }) => (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-slate-800">{title}</h1>
        </div>
    ),
};