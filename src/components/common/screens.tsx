/*
  Appellation: loading <screens>
  Contrib: @FL03
*/
'use client';

import * as React from 'react';
import { DNA } from 'react-loader-spinner';

export const LoadingScreen: React.FC = () => {
  return (
    <DNA
      visible={true}
      height="80"
      width="80"
      ariaLabel="dna-loading"
      wrapperStyle={{}}
      wrapperClass="m-auto flex flex-1 justify-center items-center"
    />
  );
};
LoadingScreen.displayName = 'LoadingScreen';
