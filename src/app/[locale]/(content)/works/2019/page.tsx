import worksEn2019 from '@/app/data/works/json/en_2019.json';
import worksZh2019 from '@/app/data/works/json/zh_2019.json';
import { createYearListPage } from '../_shared/yearListPage';

const { generateMetadata, Page } = createYearListPage({
  year: '2019',
  detailPathname: '/works/2019/[workId]',
  dicts: { en: worksEn2019, zh: worksZh2019 },
});

export { generateMetadata };
export default Page;
