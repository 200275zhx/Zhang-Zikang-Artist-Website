import worksEn2022 from '@/app/data/works/json/en_2022.json';
import worksZh2022 from '@/app/data/works/json/zh_2022.json';
import { createYearListPage } from '../_shared/yearListPage';

const { generateMetadata, Page } = createYearListPage({
  year: '2022',
  detailPathname: '/works/2022/[workId]',
  dicts: { en: worksEn2022, zh: worksZh2022 },
});

export { generateMetadata };
export default Page;
