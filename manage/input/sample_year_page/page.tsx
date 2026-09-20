import worksEn2025 from '@/app/data/works/json/en_2025.json';
import worksZh2025 from '@/app/data/works/json/zh_2025.json';
import { createYearListPage } from '../_shared/yearListPage';

const { generateMetadata, Page } = createYearListPage({
  year: '2025',
  detailPathname: '/works/2025/[workId]',
  dicts: { en: worksEn2025, zh: worksZh2025 },
});

export { generateMetadata };
export default Page;
