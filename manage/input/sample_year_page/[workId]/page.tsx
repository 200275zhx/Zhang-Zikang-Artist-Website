import worksEn2025 from '@/app/data/works/json/en_2025.json';
import worksZh2025 from '@/app/data/works/json/zh_2025.json';
import { createWorkDetailPage } from '../../_shared/workDetailPage';

const { generateStaticParams, generateMetadata, Page } = createWorkDetailPage({
  en: worksEn2025,
  zh: worksZh2025,
});

export { generateStaticParams, generateMetadata };
export default Page;
