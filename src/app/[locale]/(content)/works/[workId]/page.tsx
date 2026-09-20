import { WorksMap } from '@/app/data/works/map';
import { createWorkDetailPage } from '../_shared/workDetailPage';

const { generateStaticParams, generateMetadata, Page } = createWorkDetailPage(WorksMap);

export { generateStaticParams, generateMetadata };
export default Page;
