import type { ComponentConfig } from "@measured/puck";

export type FeatureGridProps = {
  title: string;
  items: Array<{ title: string; description: string }>;
};

export const FeatureGrid: ComponentConfig<FeatureGridProps> = {
  fields: {
    title: { type: "text", label: "عنوان القسم" },
    items: {
      type: "array",
      label: "الميزات",
      getItemSummary: (item) => item.title || "ميزة جديدة",
      arrayFields: {
        title: { type: "text", label: "العنوان" },
        description: { type: "textarea", label: "الوصف" },
      },
    },
  },
  defaultProps: {
    title: "مميزاتنا",
    items: [
      { title: "ميزة 1", description: "وصف الميزة الأولى" },
      { title: "ميزة 2", description: "وصف الميزة الثانية" },
      { title: "ميزة 3", description: "وصف الميزة الثالثة" },
    ],
  },
  render: ({ title, items }) => (
    <section className="w-full py-16 px-6 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
          {title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-200 border border-slate-100"
            >
              <div className="w-12 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                {item.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  ),
};
