export type HeaderProps = {
    logoText: string;
    navLinks: string;
    ctaText: string;
    variant: string;
    sticky: boolean;
};

export type HeadingBlockProps = {
    title: string;
};

export type FreeZoneProps = {
    columns: string;
    gap: string;
    px: string;
    py: string;
    globalRadius: string;
    globalBgColor: string;
    globalAlign: string;
};

export type BoxProps = {
    title: string;
    description: string;
    align: string;
    borderRadius: string;
    bgColor: string;
    colSpan?: number;
    rowSpan?: number;
};

export type GridProps = {
    columns: string;
    gap: string;
    px: string;
    py: string;
    cardRadius: string;
    cardBgColor: string;
    showBorder: boolean;
    align: string;
};

export type ConfigProps = {
    Header: HeaderProps;
    HeadingBlock: HeadingBlockProps;
    FreeZone: FreeZoneProps;
    Box: BoxProps;
    Grid: GridProps;
};

export type Product = {
    id: string;
    title: string;
    price: string;
    imageUrl?: string;
};

