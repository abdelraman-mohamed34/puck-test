/**
 * Pages Structure Configuration
 * This defines the pages that will be registered with Graphood
 */

export const PAGES_STRUCTURE = [
  {
    path: "/",
    title: "Home",
    defaultContent: {
      root: {},
      content: [
        {
          type: "Hero",
          id: "hero-home",
          props: {
            title: "مرحباً بك في متجرنا الإلكتروني",
            description: "نوفر لك أفضل المنتجات بأسعار تنافسية وجودة عالية",
            buttonLabel: "تصفح المنتجات",
            buttonUrl: "/products",
            backgroundColor: "#0F172A",
            textColor: "#F8FAFC"
          }
        },
        {
          type: "TextSection",
          id: "text-features",
          props: {
            title: "لماذا تختارنا؟",
            body: "نقدم تجربة تسوق سهلة وآمنة مع خيارات دفع متعددة وشحن سريع لجميع أنحاء المملكة.",
            alignment: "center"
          }
        },
        {
          type: "FeatureGrid",
          id: "features-grid",
          props: {
            title: "مميزاتنا",
            items: [
              { title: "شحن مجاني", description: "شحن مجاني للطلبات فوق 200 ريال" },
              { title: "دفع آمن", description: "خيارات دفع متعددة وآمنة 100%" },
              { title: "دعم 24/7", description: "فريق دعم متواجد على مدار الساعة" }
            ]
          }
        }
      ]
    }
  },
  {
    path: "/products",
    title: "Products",
    defaultContent: {
      root: {},
      content: [
        {
          type: "Hero",
          id: "hero-products",
          props: {
            title: "منتجاتنا",
            description: "استكشف مجموعتنا الواسعة من المنتجات المميزة",
            buttonLabel: "تواصل معنا",
            buttonUrl: "#contact",
            backgroundColor: "#1E293B",
            textColor: "#F8FAFC"
          }
        },
        {
          type: "TextSection",
          id: "text-products-intro",
          props: {
            title: "تشكيلة واسعة من المنتجات",
            body: "نقدم تشكيلة متنوعة من المنتجات التي تناسب جميع احتياجاتك بأفضل الأسعار وأعلى جودة.",
            alignment: "center"
          }
        },
        {
          type: "FeatureGrid",
          id: "products-categories",
          props: {
            title: "فئات المنتجات",
            items: [
              { title: "إلكترونيات", description: "أحدث الأجهزة الإلكترونية والتقنية" },
              { title: "أزياء", description: "ملابس عصرية للرجال والنساء" },
              { title: "منزل ومطبخ", description: "أدوات منزلية ومطبخية عالية الجودة" },
              { title: "رياضة", description: "معدات رياضية ومستلزمات اللياقة البدنية" },
              { title: "جمال وعناية", description: "منتجات العناية بالبشرة والجمال" },
              { title: "ألعاب وهدايا", description: "ألعاب أطفال وهدايا مميزة" }
            ]
          }
        }
      ]
    }
  }
] as const;

export type PageStructure = typeof PAGES_STRUCTURE[number];
