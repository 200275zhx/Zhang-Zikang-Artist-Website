import worksEn2015 from '@/app/data/works/json/en_2015.json';
import worksZh2015 from '@/app/data/works/json/zh_2015.json';
import { createWorkDetailPage } from '../../_shared/workDetailPage';

const { generateStaticParams, generateMetadata, Page } = createWorkDetailPage({
  en: worksEn2015,
  zh: worksZh2015,
});

export { generateStaticParams, generateMetadata };
export default Page;
