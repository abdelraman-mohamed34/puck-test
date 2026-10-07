import type { ComponentConfig } from "@measured/puck";

export type HeroProps = {
  title: string;
  description: string;
  buttonLabel: string;
  buttonUrl: string;
  backgroundColor: string;
  textColor: string;
};

export const Hero: ComponentConfig<HeroProps> = {
  fields: {
    title: { type: "text", label: "العنوان الرئيسي" },
    description: { type: "textarea", label: "الوصف" },
    buttonLabel: { type: "text", label: "نص الزر" },
    buttonUrl: { type: "text", label: "رابط الزر" },
    backgroundColor: { type: "text", label: "لون الخلفية (Hex)" },
    textColor: { type: "text", label: "لون النص (Hex)" },
  },
  defaultProps: {
    title: "مرحباً بك",
    description: "اكتشف منتجاتنا المميزة",
    buttonLabel: "ابدأ الآن",
    buttonUrl: "#",
    backgroundColor: "#0F172A",
    textColor: "#F8FAFC",
  },
  render: ({ title, description, buttonLabel, buttonUrl, backgroundColor, textColor }) => (
    <section
      style={{ backgroundColor, color: textColor }}
      className="w-full py-20 px-6 flex flex-col items-center justify-center text-center min-h-[500px]"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-5xl font-extrabold tracking-tight leading-tight">
          {title}
        </h1>
        <p className="text-xl opacity-90 max-w-2xl mx-auto leading-relaxed">
          {description}
        </p>
        {buttonLabel && (
          <div className="pt-4">
            <a
              href={buttonUrl || "#"}
              className="inline-block px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1"
              onClick={(e) => {
                // Prevent navigation in editor mode
                if (buttonUrl === "#" || !buttonUrl) {
                  e.preventDefault();
                }
              }}
            >
              {buttonLabel}
            </a>
          </div>
        )}
      </div>
    </section>
  ),
};
