export type PublicationItem = {
    title: string;
    src: string;
    alt: string;
    detail: PublicationDetailBlock[];
    metadata: PublicationMetadata;
};

export type PublicationDetailBlock = {
    title?: string;
    img?: string;
    vid?: string;
    description?: string;
    alt?: string;
};

export type PublicationMetadata = {
    title: string;
    description: string;
    keywords: string;
};
