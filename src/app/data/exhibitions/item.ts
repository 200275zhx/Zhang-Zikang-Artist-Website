export type ExhibitionItem = {
    title: string;
    src: string;
    alt: string;
    bgcolor: string;
    detail: ExhibitionDetailBlock[];
    metadata: ExhibitionMetadata;
};

export type ExhibitionDetailBlock = {
    title?: string;
    img?: string;
    vid?: string;
    description?: string;
    alt?: string;
    location?: string;
    dates?: string;
};

export type ExhibitionMetadata = {
    title: string;
    description: string;
    keywords: string;
};
