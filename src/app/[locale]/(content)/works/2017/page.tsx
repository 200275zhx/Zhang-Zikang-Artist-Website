import worksEn2017 from '@/app/data/works/json/en_2017.json';
import worksZh2017 from '@/app/data/works/json/zh_2017.json';
import { createYearListPage } from '../_shared/yearListPage';

const { generateMetadata, Page } = createYearListPage({
  year: '2017',
  detailPathname: '/works/2017/[workId]',
  dicts: { en: worksEn2017, zh: worksZh2017 },
});

export { generateMetadata };
export default Page;
