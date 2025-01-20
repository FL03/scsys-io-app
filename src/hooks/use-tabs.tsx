/*
  Appellation: use-tabs <hooks>
  Contrib: @FL03
*/
'use client';
// imports
import * as React from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';


type HookProps = {
  defaultTab?: string;
}
export function useTabParams(props: HookProps = { defaultTab: 'system' }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const currentTab = React.useMemo(
    () => searchParams.get('tab') || props.defaultTab,
    [props, searchParams]
  );

  const setTab = React.useCallback(
    (tab: string) => {
      const params = new URLSearchParams(searchParams);
      params.set('tab', tab);
      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, router]
  );

  return { currentTab, setTab };
}

