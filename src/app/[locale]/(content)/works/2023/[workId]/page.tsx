import worksEn2023 from '@/app/data/works/json/en_2023.json';
import worksZh2023 from '@/app/data/works/json/zh_2023.json';
import { createWorkDetailPage } from '../../_shared/workDetailPage';

const { generateStaticParams, generateMetadata, Page } = createWorkDetailPage({
  en: worksEn2023,
  zh: worksZh2023,
});

export { generateStaticParams, generateMetadata };
export default Page;
