import type { ComponentConfig } from "@measured/puck";

export type TextSectionProps = {
  title: string;
  body: string;
  alignment: "left" | "center" | "right";
};

export const TextSection: ComponentConfig<TextSectionProps> = {
  fields: {
    title: { type: "text", label: "العنوان" },
    body: { type: "textarea", label: "النص" },
    alignment: {
      type: "select",
      label: "المحاذاة",
      options: [
        { label: "يسار", value: "left" },
        { label: "وسط", value: "center" },
        { label: "يمين", value: "right" },
      ],
    },
  },
  defaultProps: {
    title: "عنوان القسم",
    body: "هذا نص تجريبي يمكنك تعديله من خلال محرر المحتوى.",
    alignment: "center",
  },
  render: ({ title, body, alignment }) => (
    <section className="w-full py-16 px-6">
      <div
        className="max-w-4xl mx-auto space-y-4"
        style={{ textAlign: alignment }}
      >
        <h2 className="text-3xl font-bold text-slate-900">{title}</h2>
        <p className="text-lg text-slate-600 leading-relaxed whitespace-pre-wrap">
          {body}
        </p>
      </div>
    </section>
  ),
};
