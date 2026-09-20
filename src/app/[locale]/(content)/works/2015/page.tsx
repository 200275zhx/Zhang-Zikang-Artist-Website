import worksEn2015 from '@/app/data/works/json/en_2015.json';
import worksZh2015 from '@/app/data/works/json/zh_2015.json';
import { createYearListPage } from '../_shared/yearListPage';

const { generateMetadata, Page } = createYearListPage({
  year: '2015',
  detailPathname: '/works/2015/[workId]',
  dicts: { en: worksEn2015, zh: worksZh2015 },
});

export { generateMetadata };
export default Page;
