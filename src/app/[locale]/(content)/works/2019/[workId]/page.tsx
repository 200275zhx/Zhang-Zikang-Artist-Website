import worksEn2019 from '@/app/data/works/json/en_2019.json';
import worksZh2019 from '@/app/data/works/json/zh_2019.json';
import { createWorkDetailPage } from '../../_shared/workDetailPage';

const { generateStaticParams, generateMetadata, Page } = createWorkDetailPage({
  en: worksEn2019,
  zh: worksZh2019,
});

export { generateStaticParams, generateMetadata };
export default Page;
