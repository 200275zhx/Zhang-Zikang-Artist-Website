import worksEn2024 from '@/app/data/works/json/en_2024.json';
import worksZh2024 from '@/app/data/works/json/zh_2024.json';
import { createWorkDetailPage } from '../../_shared/workDetailPage';

const { generateStaticParams, generateMetadata, Page } = createWorkDetailPage({
  en: worksEn2024,
  zh: worksZh2024,
});

export { generateStaticParams, generateMetadata };
export default Page;
