import type { Config } from "@measured/puck";
import { Hero, TextSection, FeatureGrid } from "@/lib/components";
import type { HeroProps } from "@/lib/components/Hero";
import type { TextSectionProps } from "@/lib/components/TextSection";
import type { FeatureGridProps } from "@/lib/components/FeatureGrid";

export type PuckConfigProps = {
  Hero: HeroProps;
  TextSection: TextSectionProps;
  FeatureGrid: FeatureGridProps;
};

const config: Config<PuckConfigProps> = {
  components: {
    Hero,
    TextSection,
    FeatureGrid,
  },
};

export default config;
