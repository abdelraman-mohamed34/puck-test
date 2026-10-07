import type { ConfigProps } from "./types/puck.types";
import { Config } from "@measured/puck";

import { Header, HeadingBlock, FreeZone, Box, Grid } from "./components";

export const config: Config<ConfigProps> = {
  components: {
    Header,
    HeadingBlock,
    FreeZone,
    Box,
    Grid,
  },
};

export default config;