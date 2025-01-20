/*
  Appellation: settings-tabs <settings>
  Contrib: @FL03
*/
'use client';
import * as React from 'react';
import { cn } from '@/utils';

import { useProfile, ProfileForm } from '@/features/profiles';
// components 
import { ImagePicker } from '@/common/image-picker';
import { Button } from '@/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/ui/tabs';

// feature-specific
import { SettingsForm } from './settings-form';
import { useSearchParams } from 'next/navigation';
import { useTabParams } from '@/hooks/use-tabs';

type SettingsTabsProps = {
  defaultTab?: string;
} & React.ComponentProps<typeof Tabs>;

export const SettingsTabs: React.FC<SettingsTabsProps> = ({
  className,
  defaultTab = 'system',
  ...props
}) => {
  const { currentTab, setTab } = useTabParams({ defaultTab });

  const { profile } = useProfile();

  if (!profile) return null;

  return (
    <Tabs
      className={cn('relative flex flex-1 flex-col gap-2 lg:gap-4', className)}
      orientation="horizontal"
      onValueChange={setTab}
      value={currentTab}
      {...props}
    >
      <TabsList>
        <TabsTrigger
          asChild
          value="system"
          className="hover:underline focus:underline [data-[state=active]_&]:italics"
        >
          <Button className="w-full" variant="link" onClick={() => setTab('system')}>
            System
          </Button>
        </TabsTrigger>
        <TabsTrigger value="profile" asChild>
          <Button className="w-full" variant="link">
            Profile
          </Button>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="system">
        <div className="flex flex-1 flex-col items-center">
          <SettingsForm />
        </div>
      </TabsContent>
      <TabsContent value="profile">
        <div className="flex flex-1 flex-col items-center">
          <ProfileForm values={{ ...profile }} />
          <ImagePicker showPreview selected={profile?.avatar_url} />
        </div>
      </TabsContent>
    </Tabs>
  );
};
SettingsTabs.displayName = 'SettingsTabs';
