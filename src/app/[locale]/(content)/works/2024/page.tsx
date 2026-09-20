import worksEn2024 from '@/app/data/works/json/en_2024.json';
import worksZh2024 from '@/app/data/works/json/zh_2024.json';
import { createYearListPage } from '../_shared/yearListPage';

const { generateMetadata, Page } = createYearListPage({
  year: '2024',
  detailPathname: '/works/2024/[workId]',
  dicts: { en: worksEn2024, zh: worksZh2024 },
});

export { generateMetadata };
export default Page;
