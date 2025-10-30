import { DrupalArea, DrupalFragment } from '@/types/nodehive';
import Fragment from '@/components/drupal/fragment/fragment';

interface AreaProps {
  area: DrupalArea;
}

export default function Area({ area }: AreaProps) {
  // TODO Check if this is getting the correct data
  const fragments = area?.data?.fragment_id;

  return (
    <div>
      {fragments?.map((fragment: DrupalFragment) => {
        return <Fragment key={fragment?.id} fragment={fragment} />;
      })}
    </div>
  );
}
