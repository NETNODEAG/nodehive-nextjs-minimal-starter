'use client';

import { useEffect, useState } from 'react';
import { Config, Render, resolveAllData } from '@measured/puck';

export interface PuckRenderProps {
  data: any;
  config: Config;
}

export default function PuckRender({ data, config }: PuckRenderProps) {
  const [resolvedData, setResolvedData] = useState(data);
  const [isResolved, setIsResolved] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const resolved = await resolveAllData(data, config);
      setResolvedData(resolved);
      setIsResolved(true);
    };
    fetchData();
  }, [data, config]);

  return (
    <div className="[&>div]:space-y-16">
      <Render
        config={config}
        data={resolvedData}
        metadata={{ isResolved: isResolved }}
      />
    </div>
  );
}
