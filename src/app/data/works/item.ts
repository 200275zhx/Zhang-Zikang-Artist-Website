export type WorkItem = {
    title: string;
    src: string;
    alt: string;
    detail: WorkDetailBlock[];
    metadata: WorkMetadata;
};

export type WorkDetailBlock = {
    title?: string;
    img?: string;
    vid?: string;
    year?: string;
    media?: string;
    size?: string;
    description?: string;
    alt?: string;
};

export type WorkMetadata = {
    title: string;
    description: string;
    keywords: string;
};
