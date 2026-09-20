import worksEn2014 from '@/app/data/works/json/en_2014.json';
import worksZh2014 from '@/app/data/works/json/zh_2014.json';
import { createWorkDetailPage } from '../../_shared/workDetailPage';

const { generateStaticParams, generateMetadata, Page } = createWorkDetailPage({
  en: worksEn2014,
  zh: worksZh2014,
});

export { generateStaticParams, generateMetadata };
export default Page;
