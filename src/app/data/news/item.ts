// export type NewsItem = {
//     title: string;
//     src: string;
//     alt: string;
//     detail: NewsDetailBlock[];
//     metadata: NewsMetadata;
// };

// export type NewsDetailBlock = {
//     title?: string;
//     img?: string;
//     vid?: string;
//     description?: string;
//     alt?: string;
// };

// export type NewsMetadata = {
//     title: string;
//     description: string;
//     keywords: string;
// };

export type NewsMetadata = {
  title: string;
  description: string;
  keywords?: string;
};

export type NewsItem = {
  title: string;
  src: string;
  alt: string;
  time?: string;
  location?: string;
  description: string;
  metadata: NewsMetadata;
  link?: string;
};