import worksEn2016 from '@/app/data/works/json/en_2016.json';
import worksZh2016 from '@/app/data/works/json/zh_2016.json';
import { createYearListPage } from '../_shared/yearListPage';

const { generateMetadata, Page } = createYearListPage({
  year: '2016',
  detailPathname: '/works/2016/[workId]',
  dicts: { en: worksEn2016, zh: worksZh2016 },
});

export { generateMetadata };
export default Page;
