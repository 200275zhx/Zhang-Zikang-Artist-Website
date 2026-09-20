import worksEn2014 from '@/app/data/works/json/en_2014.json';
import worksZh2014 from '@/app/data/works/json/zh_2014.json';
import { createYearListPage } from '../_shared/yearListPage';

const { generateMetadata, Page } = createYearListPage({
  year: '2014',
  detailPathname: '/works/2014/[workId]',
  dicts: { en: worksEn2014, zh: worksZh2014 },
});

export { generateMetadata };
export default Page;
