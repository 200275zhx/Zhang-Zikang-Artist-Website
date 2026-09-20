import worksEn2016 from '@/app/data/works/json/en_2016.json';
import worksZh2016 from '@/app/data/works/json/zh_2016.json';
import { createWorkDetailPage } from '../../_shared/workDetailPage';

const { generateStaticParams, generateMetadata, Page } = createWorkDetailPage({
  en: worksEn2016,
  zh: worksZh2016,
});

export { generateStaticParams, generateMetadata };
export default Page;
