/*
  Appellation: loading <screens>
  Contrib: @FL03
*/
'use client';

import * as React from 'react';


export const Loading: React.FC = () => {
  return (      <div className="flex flex-1 items-center justify-center m-auto w-full h-full">
        <div className="flex items-center justify-center">
          <div className="w-16 h-16 border-t-2 border-b-2 border-gray-800 rounded-full animate-spin" />
        </div>
      </div>
  );
}
Loading.displayName = 'Loading';

export default Loading;