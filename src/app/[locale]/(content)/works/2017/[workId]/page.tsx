import worksEn2017 from '@/app/data/works/json/en_2017.json';
import worksZh2017 from '@/app/data/works/json/zh_2017.json';
import { createWorkDetailPage } from '../../_shared/workDetailPage';

const { generateStaticParams, generateMetadata, Page } = createWorkDetailPage({
  en: worksEn2017,
  zh: worksZh2017,
});

export { generateStaticParams, generateMetadata };
export default Page;
