import Header from '@/components/ads/demo-play/header.component';
import Interactive from '@/components/ads/demo-play/interactive.component';
import LiveCount from '@/components/ads/demo-play/live-count.component';
import Ready from '@/components/ads/demo-play/ready.component';
import ReadyTo from '@/components/ads/demo-play/readyTo.component';
import React, { useState } from 'react';

const Demo = (): React.ReactElement => {
  const [state,setState]=useState(0)
  const handleState=():void=>{setState(1)}
  return (
    <div className="flex flex-col font-poppins justify-center items-center">
      {state !== 0 ? (
        <>
          <LiveCount />
        </>
      ) : (
        <>
          <Header handleState={handleState} />
          <Ready />
          <Interactive />
          <ReadyTo handleState={handleState} />
        </>
      )}
    </div>
  );
};

export default Demo;
