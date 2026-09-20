import worksEn2023 from '@/app/data/works/json/en_2023.json';
import worksZh2023 from '@/app/data/works/json/zh_2023.json';
import { createYearListPage } from '../_shared/yearListPage';

const { generateMetadata, Page } = createYearListPage({
  year: '2023',
  detailPathname: '/works/2023/[workId]',
  dicts: { en: worksEn2023, zh: worksZh2023 },
});

export { generateMetadata };
export default Page;
