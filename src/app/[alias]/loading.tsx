/*
  Appellation: loading <(dashboard)>
  Contrib: @FL03
*/
'use client';

import * as React from 'react';
import { LineWave } from 'react-loader-spinner';

export default function Page() {
  return <LineWave wrapperClass="flex flex-1 items-center justify-center m-auto" />;
};
Page.displayName = 'LoadingPage';

