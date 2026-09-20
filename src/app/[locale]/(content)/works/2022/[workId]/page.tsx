import worksEn2022 from '@/app/data/works/json/en_2022.json';
import worksZh2022 from '@/app/data/works/json/zh_2022.json';
import { createWorkDetailPage } from '../../_shared/workDetailPage';

const { generateStaticParams, generateMetadata, Page } = createWorkDetailPage({
  en: worksEn2022,
  zh: worksZh2022,
});

export { generateStaticParams, generateMetadata };
export default Page;
