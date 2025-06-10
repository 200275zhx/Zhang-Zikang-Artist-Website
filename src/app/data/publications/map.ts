import publicationsEn from './json/en.json';
import publicationsZh from './json/zh.json';
import publicationsArticlesEn from './json/en_articles.json';
import publicationsArticlesZh from './json/zh_articles.json';
import publicationsMonographsEn from './json/en_monographs.json';
import publicationsMonographsZh from './json/zh_monographs.json';
import publicationsEditionsEn from './json/en_editions.json';
import publicationsEditionsZh from './json/zh_editions.json';
import publicationsInterviewsEn from './json/en_interviews.json';
import publicationsInterviewsZh from './json/zh_interviews.json';
// If add more locales, import them here

export const PublicationsMap = {
  en: publicationsEn,
  zh: publicationsZh,
};

export const PublicationsArticlesMap = {
  en: publicationsArticlesEn,
  zh: publicationsArticlesZh,
};

export const PublicationsMonographsMap = {
  en: publicationsMonographsEn,
  zh: publicationsMonographsZh,
};

export const PublicationsEditionsMap = {
  en: publicationsEditionsEn,
  zh: publicationsEditionsZh,
};

export const PublicationsInterviewsMap = {
  en: publicationsInterviewsEn,
  zh: publicationsInterviewsZh,
};